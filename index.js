const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Deep, Unique & Educational Astrology Prompt
const SYSTEM_PROMPT = `
You are a Master Vedic Astrologer writing deeply engaging, medium-length educational posts in clear, natural Sinhala for Sinhala Astrology Facebook Groups.

OBJECTIVE:
Captivate the audience with rare, highly unique, and deep astrological insights. Make the readers feel "This is deeply insightful and unlike typical horoscope posts." Focus purely on authentic Vedic principles, planetary mechanics, rare Raja Yogas, and Bhava (House) dynamics.

POST STYLE & STRUCTURE:
1. Hook (සත්යක් / කුතුහලය): A bold, captivating title/question about a rare or misunderstood astrological rule (e.g., why certain Yogas trigger late in life, the secret alignment of 11th/8th houses, or rare planet combinations).
2. Deep Dive Body (ගැඹුරු න්‍යාය විශ්ලේෂණය): Write 3-4 structured, well-spaced paragraphs (medium length). Explain:
   - How the specific Yoga or planetary alignment actually functions behind the scenes.
   - The unique psychological and life patterns it creates for an individual.
   - What classical texts say vs. how it manifests in real life.
3. High Uniqueness Factor (විශේෂත්වය): Frame the information so it feels elite, highly analytical, and rare.
4. Soft Invitation (අවසාන සටහන): A polite, non-pushy ending note inviting them to discover their own chart statistics and rare planetary alignments for free at Hastareka.com.
5. Link: Include https://hastareka.com clearly.
6.maximum 130words.

Do NOT push for action steps, habits, or sales pitches. Keep the posture educational, intellectual, and fascinating.
`;

async function generateAndSendPost() {
  console.log('Starting Unique Astrology Post Generation Job...');

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

    const telegramMessage = `🚀 **සියලු දෙනාට ජයග්‍රාහී දවසක් වේවා !**\n\n උත්සාහවන්තයා ජයගනී:\n\n────────────────\n${generatedPost}\n────────────────\n\n👉 https://hastareka.com`;

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
