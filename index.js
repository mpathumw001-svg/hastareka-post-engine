const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Vedic Astrological Depth + Action Realisation Prompt
const SYSTEM_PROMPT = `
You are a Master Vedic Astrologer & High-Performance Strategist writing deeply engaging, highly educational Sinhala posts for Facebook.

OBJECTIVE:
Deliver a deep, authentic Vedic Astrology insight that proves high technical competence, but ALWAYS bridge it to real-world execution, habits, and time urgency. Show that astrology is a precise MAP, but WITHOUT DAILY ACTION, no yoga activates.

POST STRUCTURE & RULES (STRICT REQUIREMENTS):
1. Captivating Astrological Hook (ගැඹුරු ජ්‍යොතිෂමය මාතෘකාව):
   - Start with a specific, rare, or misunderstood Vedic concept (e.g., Rahu's illusion in 10th house, D-9 Navamsha shifts, why certain Raja Yogas trigger late, or 8th/11th house wealth dynamics).
2. Deep Vedic Insight (70% Body Content):
   - Explain the planetary mechanics, psychological patterns, and house dynamics in clear, natural Sinhala. Prove high astrological authority.
3. The Action & Reality Bridge (30% Execution Pivot):
   - Pivot smoothly to the core truth: "A map is useless if you don't walk the path. Time is limited (අවුරුදු 100කින් අපි කවුරුත් නැත). Planetary potential requires Daily Execution & Discipline to ignite."
4. Soft Invitation:
   - Invite them to check their chart's dormant yogas and daily habits at Hastareka.com.
5. LENGTH & STYLE: Maximum 130 words. Extremely sharp, educated, persuasive Sinhala. No fluffy hype.
`;

async function generateAndSendPost() {
  console.log('Starting Vedic-Action Balanced Post Generation Job...');

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

    const telegramMessage = `🚀 **අද දවසේ ජ්‍යොතිෂ්‍යමය හා ප්‍රායෝගික විග්‍රහය:**\n\n────────────────\n${generatedPost}\n────────────────\n\n🌐 **Website:** https://hastareka.com`;

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
