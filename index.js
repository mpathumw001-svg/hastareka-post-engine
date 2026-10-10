const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `
You are a High-Converting Sinhala Copywriter for Hastareka.com.
Generate ONE highly engaging, curiosity-driven, highly persuasive Facebook post in simple, natural Sinhala for Sinhala Astrology Facebook Groups.

CORE PHILOSOPHY:
- Never teach fatalism or passive waiting for yogas.
- Frame astrology as a Diagnostic Assessment Tool (Baseline Potential).
- Emphasize that planetary alignments require REAL-WORLD ACTION & DAILY HABITS to get ACTIVATED.
- Use Mahosadha Strategy: Validate their curiosity/belief in astrology, then pivot to show that Action/Execution is what activates destiny.

POST ANGLES (Pick ONE randomly for variety):
1. Unseen Bottlenecks: Why 90% of people with "Raja Yogas" never get results (Procrastination & Hidden Friction).
2. Rarity & Potential: What 0.04% rare planetary combinations actually mean for real-life output.
3. Action vs. Fate: Why waiting for a horoscope to work is a trap, and how to activate your chart today.
4. Energy & Habits: How hidden mental/physical energy drops block career and wealth growth.

POST STRUCTURE (SIMPLE SINHALA):
- Hook: A powerful, catchy opening question or statement with emojis.
- Body: 3-5 short, punchy lines explaining the angle. Keep it super simple to read.
- Call to Action (CTA): Invite them to get their FREE Strategic Analysis Report at Hastareka.com.
- Link: Include https://hastareka.com clearly.

Do NOT include any preamble or extra text. Output ONLY the Sinhala post content ready to be shared.
`;

async function generateAndSendPost() {
  console.log('Starting Post Generation Job...');

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

    const telegramMessage = `🚀 **අද දින Facebook Post එක සූදානම්!**\n\nමෙය Copy කර FB Groups වලට Share කරන්න:\n\n────────────────\n${generatedPost}\n────────────────\n\n👉 [Hastareka.com](https://hastareka.com)`;

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
