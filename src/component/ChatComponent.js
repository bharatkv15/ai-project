import React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";
import SpeechToText from "./SpeechToText";
import { sendMsgToGeminiAI } from "../geminiai";
import { SheetSide } from "./SheetComponent";
import { useSelector } from "react-redux";
export const ChatComponent = () => {
  const user = useSelector(
    (state) =>
      state?.user?.userInfo?.data?.results[0]?.alternatives[0]?.transcript
  );
  const msgEnd = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi! ask your query.",
      isBot: true,
    },
  ]);
  const [history, setHistory] = useState([]);
  const [newChatSession, setNewChatSession] = useState(false);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  useEffect(() => {
    setUserInput(user);
  }, [user]);

  const handleUserSearch = async () => {
    if (userInput !== "" && userInput !== undefined) {
      const text = userInput;
      setUserInput("");
      setMessages([...messages, { text, isBot: false }]);
      const res = await sendMsgToGeminiAI(text);
      setMessages([
        ...messages,
        { text, isBot: false },
        { text: res, isBot: true },
      ]);
      if(newChatSession) {
        setHistory([
          ...history,
          {
            id: text,
            sessionHistory: [
              ...messages,
              { text, isBot: false },
              { text: res, isBot: true },
            ],
          },
        ]);
        setNewChatSession(false);
      } else {
        setHistory([
          {
            id: text,
            sessionHistory: [
              ...messages,
              { text, isBot: false },
              { text: res, isBot: true },
            ],
          },
        ]);
      }
    }
  };

  console.log(history);

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
        setUserInput={setUserInput}
        setMessages={setMessages}
        messages={messages}
        history={history}
        checkNewChatSession={checkNewChatSession}
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
