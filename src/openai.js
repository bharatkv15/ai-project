import OpenAI from "openai";

// Need to update api key
//const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function sendMsgToOpenAI(message) {
    const res = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        prompt: message,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presense_penalty: 0,
    });

    return res.data.choices[0].text;
}