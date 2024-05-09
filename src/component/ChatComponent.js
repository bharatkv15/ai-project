import React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { sendMsgToOpenAI } from "../openai";
import { Plus, Send } from "lucide-react";
import SpeechToText from "./SpeechToText";

export const ChatComponent = () => {
  const msgEnd = useRef(null);

  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Hi! ask your query.",
      isBot: true,
    },
  ]);
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleUserSearch = async () => {
    const text = userInput;
    setUserInput("");
    setMessages([...messages, { text, isBot: false }]);
    const res = await sendMsgToOpenAI(text);
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: res, isBot: true },
    ]);
    console.log(res);
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);
  return (
    <>
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            {/* <img src="" alt="" className="logo" /> */}
            <span className="brand">AI Proj</span>
          </div>
          <Button className="midBtn">
            <Plus />
            New Chat
          </Button>
          <div className="upperSideBottom">
            <Button className="query">Bharat Testing 1</Button>
            <Button className="query">Bharat Testing 2</Button>
          </div>
        </div>
        {/* <div className="lowerSide">
          <div className="listItems">Item 1</div>
          <div className="listItems">Item 2</div>
          <div className="listItems">Item 3</div>
        </div> */}
      </div>
      <div className="main">
        <div className="chats">
          {messages.map((message, index) => (
            <div key={index} className={message.isBot ? "chat bot" : "chat"}>
              {/* <img src="" alt="" /> */}
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
              placeholder="Send your query..."
            />
            <Button className="send" onClick={handleUserSearch}>
              <Send className="sendButton" />
            </Button>
            <Button className="send" onClick={handleUserSearch}>
              <SpeechToText />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
