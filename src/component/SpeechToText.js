import axios from "axios";
import React, { useState, useEffect } from "react";
import { googleSpeechToText } from "../googleSpeechToText";
import { Mic, MicOff } from "lucide-react";

const SpeechToText = ({ readTranscript }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [transcription, setTranscription] = useState("");

  // Cleanup function to stop recording and release media resources
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [mediaRecorder]);

  if (!process.env.REACT_APP_GOOGLE_API_KEY) {
    throw new Error("REACT_APP_GOOGLE_API_KEY not found in the environment");
  }

  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();
      //      console.log("Recording started");

      // Event listener to handle data availability
      recorder.addEventListener("dataavailable", async (event) => {
        //       console.log("Data available event triggered");
        const audioBlob = event.data;

        const base64Audio = await googleSpeechToText(audioBlob);
        //console.log('Base64 audio:', base64Audio);

        try {
          // const startTime = performance.now();

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

          // const endTime = performance.now();
          // const elapsedTime = endTime - startTime;

          //console.log('API response:', response);
          //     console.log("Time taken (ms):", elapsedTime);

          if (response.data.results && response.data.results.length > 0) {
            setTranscription(
              response.data.results[0].alternatives[0].transcript
            );
            
          } else {
            // console.log(
            //   "No transcription results in the API response:",
            //   response.data
            // );
            setTranscription("");
          }
        } catch (error) {
          console.error(
            "Error with Google Speech-to-Text API:",
            error.response.data
          );
        }
      });

      setRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error getting user media:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  useEffect(() => {
          readTranscript(transcription);
  },[transcription, readTranscript])

  const recordingButton = (
    <div>
      {!recording ? (
        <MicOff className="micIcon" onClick={startRecording} />
      ) : (
        <Mic className="micIcon" onClick={stopRecording} />
      )}
    </div>
  );

  return recordingButton;
};

export default SpeechToText;
