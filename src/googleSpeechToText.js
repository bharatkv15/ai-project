import axios from "axios";

// Function to convert audio blob to base64 encoded string
export const googleSpeechToText = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result;
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      resolve(base64Audio);
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

export const googleSpeechToTextCallApi = async (base64Audio) => {
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const response = await axios.post(
    `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
    {
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-US",
      },
      audio: {
        content: base64Audio,
      },
    }
  );
  return response;
};
