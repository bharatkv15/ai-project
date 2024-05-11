import React, { useState, useEffect } from "react";
import {
  googleSpeechToText,
  googleSpeechToTextCallApi,
} from "../googleSpeechToText";
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recorder.start();
      //console.log("Recording started");
      // Event listener to handle data availability
      recorder.addEventListener("dataavailable", async (event) => {
        const audioBlob = event.data;
        const base64Audio = await googleSpeechToText(audioBlob);
        try {
          const response = await googleSpeechToTextCallApi(base64Audio);
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
  }, [transcription]);

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
