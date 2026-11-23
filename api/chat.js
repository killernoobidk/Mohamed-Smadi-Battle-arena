export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY is not configured' });

  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const cleaned = messages
    .filter((message) =>
      message &&
      ['system', 'user', 'assistant'].includes(message.role) &&
      typeof message.content === 'string'
    )
    .slice(-20)
    .map((message) => ({ role: message.role, content: message.content.slice(0, 4000) }));

  if (!cleaned.length) return res.status(400).json({ error: 'A message is required' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: cleaned,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'OpenAI request failed'
      });
    }

    return res.status(200).json({
      reply: data.choices?.[0]?.message?.content || 'No response received.'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Could not connect to OpenAI' });
  }
}
