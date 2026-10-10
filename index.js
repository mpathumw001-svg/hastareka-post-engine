const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Authentic Astrology & Yogas Educational Prompt
const SYSTEM_PROMPT = `
You are an expert Vedic Astrologer writing educational and highly engaging posts in clear, natural Sinhala for Sinhala Astrology Facebook Groups.

OBJECTIVE:
Educate readers purely on traditional Vedic Astrology principles, Raja Yogas, planetary combinations, and their authentic astrological effects. Do NOT preach about action steps, habit changes, or personal development. Keep it purely focused on astrological logic and fascination.

TOPICS (Pick ONE randomly for each post):
1. Rare Pancha Mahapurusha Yogas (Hamsa, Malavya, Ruchaka, Bhadra, Sasa) - how they form and their classical effects.
2. Powerful Dhana Yogas & Raja Yogas (e.g., Budhaditya, Sunapha, Gajakesari, 11th house combinations) - what planets create them.
3. Astrological theory of Houses (Bhavas) - e.g., 10th house for career status, 11th house for gains, 8th house for transformations.
4. Dasha & Transit theory - how planetary periods activate specific yogas in a chart.

POST STRUCTURE (SIMPLE & ELEGANT SINHALA):
- Hook: A captivating title/question about a specific Yoga or Astrological rule (with emojis).
- Educational Body: 4-6 short, rich lines explaining the astrological theory, planet placements, and what results it brings according to classical astrology.
- Soft CTA (End note only): A simple 1-line sentence inviting them to check if they have these yogas in their own chart via Hastareka.com.
- Link: https://hastareka.com

Output ONLY the Sinhala post text ready to copy-paste.
`;

async function generateAndSendPost() {
  console.log('Starting Educational Post Generation Job...');

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

    const telegramMessage = `🚀 **අද දින ජ්‍යොතිෂ Post එක සූදානම්!**\n\nමෙය Copy කර FB Groups වලට Share කරන්න:\n\n────────────────\n${generatedPost}\n────────────────\n\n👉 https://hastareka.com`;

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
