import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SYSTEM_PROMPT = `
You are an AI assistant for a local Indian Kirana (grocery) store application.
The user will input an order dictated via Voice-to-Text in Hinglish or Hindi/Marathi/Punjabi.
Your task is to parse this input and strictly output a JSON object mapping to the following schema:
{
  "customerName": string (The name of the customer. Use "Unknown" if not mentioned),
  "items": [
    {
      "name": string (Item name),
      "quantity": string (Quantity + unit, e.g., "1 kg", "2 liter", "500 gram")
    }
  ],
  "paymentStatus": string (Must be exactly "CASH" or "CREDIT". Use "CREDIT" if words like "uddhar" or "baaki" are used. Use "CASH" otherwise unless specified.),
  "totalAmount": number (The total amount in Rs if mentioned, otherwise 0)
}
Return ONLY valid JSON and no other text. Do not wrap code in markdown.
`;

export const getSelectedLLMConfig = async () => {
  const config = await AsyncStorage.getItem('llm_config');
  if (config) {
    return JSON.parse(config);
  }
  return { provider: 'gemini', keys: { gemini: '', openai: '', anthropic: '' } };
};

export const parseSpeechToTransaction = async (spokenText) => {
  try {
    const config = await getSelectedLLMConfig();
    const provider = config.provider;
    const apiKey = config.keys[provider];

    if (!apiKey) {
      throw new Error(`API Key for ${provider} is missing. Please configure it in settings.`);
    }

    let parsedResultStr = '';

    if (provider === 'openai') {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: spokenText }
          ],
          temperature: 0.1
        },
        { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } }
      );
      parsedResultStr = response.data.choices[0].message.content;

    } else if (provider === 'gemini') {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                contents: [
                    { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\nInput: " + spokenText }] }
                ]
            },
            { headers: { 'Content-Type': 'application/json' } }
        );
        parsedResultStr = response.data.candidates[0].content.parts[0].text;

    } else if (provider === 'anthropic') {
         const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-haiku-20240307',
                system: SYSTEM_PROMPT,
                messages: [{ role: 'user', content: spokenText }],
                max_tokens: 300,
                temperature: 0.1
            },
            {
                headers: {
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01',
                    'Content-Type': 'application/json'
                }
            }
         );
         parsedResultStr = response.data.content[0].text;
    }

    // Attempt to parse strictly just in case JSON is wrapped in markdown
    const cleanedStr = parsedResultStr.replace(/```json/g, '').replace(/```/g, '').trim();
    const resultJson = JSON.parse(cleanedStr);
    
    return resultJson;
  } catch (error) {
    console.error('LLM Parsing Error:', error?.response?.data || error.message);
    throw new Error('Failed to parse text via LLM: ' + (error?.response?.data?.error?.message || error.message));
  }
};
