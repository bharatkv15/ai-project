import React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Send } from "lucide-react";
import SpeechToText from "./SpeechToText";
import { sendMsgToGeminiAI } from "../geminiai";
import { SheetSide } from "./SheetComponent";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateUser3 } from "../features/userquery/UserSlice2";
export const ChatComponent = () => {
  const user = useSelector(
    (state) =>
      state?.user?.userInfo?.data?.results[0]?.alternatives[0]?.transcript
  );
  const msgEnd = useRef(null);
  const dispatch = useDispatch();
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
      const res = await sendMsgToGeminiAI(text);
      setMessages([...messages, { key: text, value: res }]);
      if (newChatSession) {
        let dummyResult = [...history];
        let temp = {
          id: dummyResult[dummyResult?.length - 1]?.id
            ? dummyResult[dummyResult?.length - 1]?.id + 1
            : 1,
          sessionHistory: [...messages, { key: text, value: res }],
        };
        dummyResult.push({ ...temp });
        setHistory([...history, temp]);
        setNewChatSession(false);
      } else {
        let dummyResult = [...history];
        let result = dummyResult[dummyResult?.length - 1];
        if (result) {
          result?.sessionHistory?.push(...messages, { key: text, value: res });
          setHistory([...dummyResult]);
        } else {
          setHistory([
            {
              sessionHistory: [...messages, { key: text, value: res }],
            },
          ]);
        }
      }
      // dispatch(updateUser3(history));
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
      {console.log(history)}
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
              <p className="txt">{message.value}</p>
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
