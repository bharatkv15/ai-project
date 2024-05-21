import React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";
import SpeechToText from "./SpeechToText";
import { sendMsgToGeminiAI } from "../geminiai";
import { SheetSide } from "./SheetComponent";
import { useDispatch, useSelector } from "react-redux";
import { updateMessages } from "../features/userquery/MessageSlice";
export const ChatComponent = () => {
  const speechToText = useSelector(
    (state) =>
      state?.speechToText?.speechtoTextInfo?.data?.results[0]?.alternatives[0]?.transcript
  );
  const messages = useSelector((state) => state?.message?.chatInfo);
  const msgEnd = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [checkSessionId, setCheckSessionId] = useState(0);
  const [newChatSession, setNewChatSession] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    setUserInput(speechToText);
  }, [speechToText]);

  const handleUserSearch = async () => {
    if (userInput !== "" && userInput !== undefined) {
      const text = userInput;
      setUserInput("");
      const res = await sendMsgToGeminiAI(text);
      dispatch(updateMessages([...messages, { key: text, value: res }]));

      if (newChatSession) {
        setCheckSessionId(0);
        let temp = {
          id: idCounter,
          sessionHistory: [...messages, { key: text, value: res }],
        };
        setIdCounter((c) => c + 1);
        setHistory([...history, temp]);
        setNewChatSession(false);
      } else {
        let dummyResult = [...history];
        let result = dummyResult.find((e) => e?.id === checkSessionId);
        if (result) {
          result?.sessionHistory?.push({ key: text, value: res });
          setHistory([...dummyResult]);
          setCheckSessionId(idCounter);
        } else {
          setHistory([
            {
              id: idCounter,
              sessionHistory: [...messages, { key: text, value: res }],
            },
          ]);
          setIdCounter((c) => c + 1);
          setCheckSessionId(0);
        }
      }
    }
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter") {
      setUserInput("");
      await handleUserSearch();
    }
  };

  const checkNewChatSession = (e) => {
    setNewChatSession(e);
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  return (
    <>
      <SheetSide
        history={history}
        checkNewChatSession={checkNewChatSession}
        setCheckSessionId={setCheckSessionId}
      />
      <div className="main">
        <div className="chats">
          {messages?.map((message, index) => (
            <div key={index}>
              <div key={`chat-${index}`} className="chat">
                <p className="txt">{message?.key}</p>
              </div>
              <div key={`bot-${index}`} className="chat bot">
                <p className="txt">{message?.value}</p>
              </div>
            </div>
          ))}
          <div ref={msgEnd} />
        </div>
        <div className="chatFooter">
          <div className="inp">
            <Input
              type="text"
              name=""
              value={userInput || ""}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={handleEnter}
              placeholder="Send your query..."
            />
            <Button className="send" onClick={handleUserSearch}>
              <Send className="sendButton" />
            </Button>
            <Button className="send">
              <SpeechToText />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
