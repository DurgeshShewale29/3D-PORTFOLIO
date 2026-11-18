import { NextResponse } from 'next/server';
import { profile, experience, projects, skills, education, certifications } from '@/portfolio.config';

const SYSTEM_PROMPT = `You are Durgesh Rajendra Shewale's official Copilot AI assistant, embedded inside his Visual Studio Code themed portfolio.
Your goal is to answer any question about Durgesh clearly, professionally, and accurately based ONLY on his resume data below:

Name: ${profile.name}
Role: ${profile.role}
Current: ${profile.currentPosition}
Location: ${profile.location}
Phone: ${profile.phone}
Email: ${profile.email}
GitHub: https://github.com/DurgeshShewale29
LinkedIn: https://www.linkedin.com/in/durgesh-shewale-/

Summary:
${profile.intro}

Internships / Experience:
${experience.map(e => `• ${e.role} at ${e.company} (${e.period}): ${e.highlights?.join(' ')}`).join('\n')}

Projects:
${projects.map(p => `• ${p.title}: ${p.description}`).join('\n')}

Education:
${education.map(ed => `• ${ed.degree} from ${ed.institution} (${ed.period}) - ${ed.score}`).join('\n')}

Certifications:
${certifications.map(c => `• ${c.title} by ${c.issuer} (${c.year})`).join('\n')}

Technical Skills:
${Object.entries(skills).map(([cat, list]) => `${cat}: ${list.join(', ')}`).join('\n')}

Rules:
1. Always be polite, helpful, and concise.
2. Use markdown formatting with bold text where appropriate.
3. If asked how to contact him, give his email (${profile.email}) and phone (${profile.phone}).
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // 1. Groq API (Ultra-fast inference via server-side process.env - NEVER exposed to client)
    const rawGroqKey = process.env.GROQ_API_KEY || '';
    const groqKey = rawGroqKey.replace(/^["']|["']$/g, '').trim();
    const rawGroqModel = process.env.GROQ_MODEL || '';
    const groqModel = rawGroqModel.replace(/^["']|["']$/g, '').trim() || 'llama-3.3-70b-versatile';

    if (groqKey && groqKey !== 'your-groq-api-key') {
      try {
        let res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: groqModel,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: message },
            ],
            temperature: 0.6,
            max_tokens: 1024,
          }),
        });

        // If custom model failed, retry with Groq's universal flagship model
        if (!res.ok && groqModel !== 'llama-3.3-70b-versatile') {
          console.warn(`Groq model "${groqModel}" returned status ${res.status}. Retrying with llama-3.3-70b-versatile...`);
          res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: message },
              ],
              temperature: 0.6,
              max_tokens: 1024,
            }),
          });
        }

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ reply });
          }
        } else {
          const errText = await res.text();
          console.error('Groq API error:', res.status, errText);
        }
      } catch (err) {
        console.error('Groq fetch error:', err);
      }
    }

    // 2. Gemini API fallback
    const geminiKey = (process.env.GEMINI_API_KEY || '').replace(/^["']|["']$/g, '').trim();
    if (geminiKey && geminiKey !== 'your-api-key') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${SYSTEM_PROMPT}\n\nUser Question: ${message}` }],
              },
            ],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return NextResponse.json({ reply });
        }
      }
    }

    // 3. OpenAI API fallback
    const openaiKey = (process.env.OPENAI_API_KEY || '').replace(/^["']|["']$/g, '').trim();
    if (openaiKey && openaiKey !== 'your-api-key') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: message },
          ],
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ reply });
        }
      }
    }

    // Default response returning fallback to instant local engine
    return NextResponse.json({ fallback: true });
  } catch (error) {
    return NextResponse.json({ fallback: true });
  }
}
