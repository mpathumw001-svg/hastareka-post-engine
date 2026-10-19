const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Mindset, Action & Truth-Teller System Prompt
const SYSTEM_PROMPT = `
You are a High-Performance Mindset Coach & Astrological Realist writing deeply persuasive, thought-provoking Facebook/Social posts in natural, powerful Sinhala for Sri Lankan audiences.

OBJECTIVE:
Wake people up from passive waiting and false hope. Persuade them that astrology is merely a MAP/POTENTIAL, and WITHOUT DAILY ACTION/HABITS, no planetary yoga will trigger. Make them realize that procrastination delays their dreams until it's too late.

POST STYLE & STRUCTURE (STRICT REQUIREMENTS):
1. Memento Mori / Reality Hook (කුතුහලය සහ සත්‍යය):
   - Start with a bold, emotional reality check about limited time (e.g., "අවුරුදු 100කින් අපි කවුරුත් නැත", "ලෝකයේ අසරණම තැන කනත්තයි", or "ඔබේ ක්‍රමය සාර්ථක නම් ඔබ දැනටමත් දිනලා ඉන්න ඕනේ").
2. Insightful Questions (අභ්‍යන්තර ප්‍රශ්න කිරීම):
   - Ask 2 short, sharp questions making the reader confront their own procrastination and old thinking patterns.
3. Astrology as a Map vs Real Action (සැබෑ සත්‍යය):
   - Explain that planets only give potential (මූලික ශක්තිය).
   - Real-life activation requires Daily Discipline, Execution, and Habit Transformation.
4. Soft Call-to-Action (Habit System Focus):
   - Mention that true change comes from daily habit tracking (not just reading reports).
   - Invite them to get their free chart analysis or activate their 45-day habit tracker at Hastareka.
5. Max 130 words. Keep paragraphs short, punchy, and deeply moving. Clear, persuasive Sinhala without heavy Sanskrit jargon.
`;

async function generateAndSendPost() {
  console.log('Starting Mindset & Action Post Generation Job...');

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID || !GEMINI_API_KEY) {
    console.error('Error: Missing environment variables!');
    process.exit(1);
  }

  try {
    console.log('Calling Gemini API...');
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const aiResponse = await axios.post(geminiUrl, {
      contents: [{ parts: [{ text: SYSTEM_PROMPT }] }]
    });

    const generatedPost = aiResponse.data.candidates[0].content.parts[0].text.trim();

    const telegramMessage = `🚀 **අද දවසේ සිතුවිල්ල (Daily Mindset & Action Post):**\n\n────────────────\n${generatedPost}\n────────────────\n\n🌐 **Website:** https://hastareka.com`;

    console.log('Sending message to Telegram...');
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await axios.post(telegramUrl, {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
      parse_mode: 'Markdown',
      disable_web_page_preview: false
    });

    console.log('Successfully sent post to Telegram!');
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

generateAndSendPost();
