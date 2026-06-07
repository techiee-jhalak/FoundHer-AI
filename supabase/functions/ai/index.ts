// FoundHer AI - unified edge function for AI Coach (streaming chat) and Idea Validator (structured).
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
const GATEWAY = 'https://ai.gateway.lovable.dev/v1/chat/completions';
const MODEL = 'google/gemini-3-flash-preview';

const COACH_SYSTEM = `You are FoundHer, an elite AI co-founder for women entrepreneurs.
You are warm, sharp, candid, and deeply experienced (think a16z partner crossed with a beloved startup mentor).
You give specific, actionable, opinionated guidance — never generic platitudes.
Use short paragraphs and tight bullet lists. Ask one clarifying question when truly needed.
You champion women founders without being patronizing. Default to high standards and global ambition.`;

const VALIDATOR_SYSTEM = `You are an elite startup analyst. Given a one-line startup idea, produce a rigorous validation report.
Be specific to the idea — name real competitors, real market segments, real revenue mechanics.
Return ONLY valid JSON matching the requested schema. No prose, no markdown.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const mode = body.mode as 'coach' | 'validate';

    if (mode === 'validate') {
      const idea = String(body.idea ?? '').trim();
      if (!idea || idea.length < 8) {
        return new Response(JSON.stringify({ error: 'Idea is too short.' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const prompt = `Startup idea: """${idea}"""

Return JSON with this exact shape:
{
  "score": number (0-100, overall idea strength),
  "marketDemand": { "score": number (0-100), "summary": string (2-3 sentences) },
  "competitors": [ { "name": string, "note": string } ] (3-5 real, named companies or substitutes),
  "revenue": [ string ] (3 concrete monetization paths),
  "risks": [ string ] (3-4 specific, non-obvious risks),
  "recommendations": [ string ] (4 next actions, each starting with a verb),
  "tagline": string (one bold, investor-ready positioning line),
  "tam": string (a credible TAM estimate with reasoning, one sentence)
}`;

      const r = await fetch(GATEWAY, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: 'system', content: VALIDATOR_SYSTEM },
            { role: 'user', content: prompt },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (!r.ok) {
        const txt = await r.text();
        const status = r.status === 429 ? 429 : r.status === 402 ? 402 : 500;
        return new Response(JSON.stringify({ error: txt || 'AI error' }), {
          status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const data = await r.json();
      const content = data.choices?.[0]?.message?.content ?? '{}';
      let parsed: unknown;
      try {
        parsed = JSON.parse(content);
      } catch {
        parsed = { error: 'parse_failed', raw: content };
      }
      return new Response(JSON.stringify(parsed), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Coach (streaming)
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const contextLine = body.context ? `\nFounder context: ${body.context}` : '';
    const r = await fetch(GATEWAY, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        stream: true,
        messages: [
          { role: 'system', content: COACH_SYSTEM + contextLine },
          ...messages,
        ],
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      const status = r.status === 429 ? 429 : r.status === 402 ? 402 : 500;
      return new Response(JSON.stringify({ error: txt || 'AI error' }), {
        status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(r.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
