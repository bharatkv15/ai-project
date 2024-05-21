import React, { useState, useEffect } from "react";
import { googleSpeechToText } from "../googleSpeechToText";
import { Mic, MicOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateSpeechToText } from "../features/userquery/SpeechToTextSlice";
const SpeechToText = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const dispatch = useDispatch();

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
      recorder.addEventListener("dataavailable", async (event) => {
        const audioBlob = event.data;
        const base64Audio = await googleSpeechToText(audioBlob);
        try {
          dispatch(updateSpeechToText(base64Audio));
        } catch (error) {
          console.error("Error with Google Speech-to-Text API:", error);
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
