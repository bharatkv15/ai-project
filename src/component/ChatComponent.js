import React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";
import SpeechToText from "./SpeechToText";
import { sendMsgToGeminiAI } from "../geminiai";
import { SheetSide } from "./SheetComponent";

export const ChatComponent = () => {
  const msgEnd = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi! ask your query.",
      isBot: true,
    },
  ]);
  const [history, setHistory] = useState([]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleUserSearch = async () => {
    const text = userInput;
    setUserInput("");
    setMessages([...messages, { text, isBot: false }]);
    const res = await sendMsgToGeminiAI(text);
    setHistory([...history, { text: text, message: res }]);
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: res, isBot: true },
    ]);
  };

  const handleEnter = async (e) => {
    if (e.key === "Enter" && userInput !== "") {
      setUserInput("");
      await handleUserSearch();
    }
  };

  const readTranscript = async (e) => {
    await setUserInput(e);
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  return (
    <>
      <SheetSide
        setUserInput={setUserInput}
        setMessages={setMessages}
        messages={messages}
        history={history}
      />
      <div className="main">
        <div className="chats">
          {messages.map((message, index) => (
            <div key={index} className={message.isBot ? "chat bot" : "chat"}>
              <p className="txt">{message.text}</p>
            </div>
          ))}
          <div ref={msgEnd} />
        </div>
        <div className="chatFooter">
          <div className="inp">
            <Input
              type="text"
              name=""
              value={userInput}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={handleEnter}
              placeholder="Send your query..."
            />
            <Button className="send" onClick={handleUserSearch}>
              <Send className="sendButton" />
            </Button>
            <Button className="send">
              <SpeechToText readTranscript={readTranscript} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
