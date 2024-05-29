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
import { doc, setDoc, getDoc } from "firebase/firestore/lite";
import { db } from "../firebase";

export const ChatComponent = ({ authUser }) => {
  const messages = useSelector((state) => state?.message?.chatInfo);
  const msgEnd = useRef(null);
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState([]);
  const [checkSessionId, setCheckSessionId] = useState(null);
  const [newChatSession, setNewChatSession] = useState(false);
  const [idCounter, setIdCounter] = useState(0);
  const dispatch = useDispatch();
  const speechToText = useSelector((state) =>
    state?.speechToText?.speechtoTextInfo?.data?.results !== undefined
      ? state?.speechToText?.speechtoTextInfo?.data?.results[0]?.alternatives[0]
          ?.transcript
      : ""
  );

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const setFireStoreData = async (history) => {
    try {
      if (authUser) {
        const userDocRef = doc(db, "users", authUser.uid);
        await setDoc(userDocRef, {
          ...history,
          // timeStamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserSearch = async () => {
    try {
      if (userInput !== "" && userInput !== undefined) {
        const text = userInput;
        setUserInput("");
        const res = await sendMsgToGeminiAI(text);
        dispatch(updateMessages([...messages, { key: text, value: res }]));

        if (newChatSession) {
          setIdCounter((c) => c + 1);
          let temp = {
            id: idCounter,
            sessionHistory: [...messages, { key: text, value: res }],
          };
          setHistory([...history, temp]);
          setNewChatSession(false);
          setCheckSessionId(null);
          setFireStoreData([...history, temp]);
        } else if (checkSessionId === null && idCounter === 0) {
          setHistory([
            {
              id: idCounter,
              sessionHistory: [...messages, { key: text, value: res }],
            },
          ]);
          setIdCounter((c) => c + 1);
          if (authUser) {
            const userDocRef = await doc(db, "users", authUser.uid);
            const docSnap = await getDoc(userDocRef);
            let docSnapArray = [];
            if (docSnap.exists()) {
              let test = docSnap.data();
              for (const obj in test) {
                docSnapArray.push(test[obj]);
              }
              if (docSnapArray.length > 0) {
                setFireStoreData([
                  ...docSnapArray,
                  {
                    id: idCounter,
                    sessionHistory: [...messages, { key: text, value: res }],
                  },
                ]);
              } else {
                setFireStoreData(...history);
              }
            } else {
              console.log("No such document!");
            }
          }
        } else if (checkSessionId !== null) {
          let dummyResult = [...history];
          let result = dummyResult.find((e) => e?.id === checkSessionId);
          if (result) {
            result?.sessionHistory?.push({ key: text, value: res });
            setHistory([...dummyResult]);
          }
          setFireStoreData([...dummyResult]);
        } else {
          let dummyResult = [...history];
          let result = dummyResult.find((e) => e?.id === idCounter - 1);
          if (result) {
            result?.sessionHistory?.push({ key: text, value: res });
            setHistory([...dummyResult]);
            setFireStoreData([...dummyResult]);
          }
        }
      }
    } catch (error) {
      console.error(error);
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

  const messageParser = (message) => {
    try {
      const lines = message.split("\n").filter((line) => line.trim() !== "");
      const outputMessage = [];

      lines.forEach((line, index) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          outputMessage.push(<b key={index}>{line.replace(/\*\*/g, "")}</b>);
        } else if (line.startsWith("* **")) {
          const parts = line.split(":");
          outputMessage.push(
            <li key={index}>
              <strong>{parts[0].replace(/\*\*/g, "")}</strong>:{" "}
              {parts.slice(1).join(":").trim()}
            </li>
          );
        } else if (line.startsWith("*")) {
          outputMessage.push(<li key={index}>{line.replace("* ", "")}</li>);
        } else if (line === "") {
        } else {
          outputMessage.push(<p key={index}>{line}</p>);
        }
      });

      return outputMessage;
    } catch (error) {
      alert("Something went wrong, please try sometime !");
      // console.log(error);
      return "Something went wrong, please try after sometime !";
    }
  };

  useEffect(() => {
    msgEnd.current.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    setUserInput(speechToText);
  }, [speechToText]);

  return (
    <>
      <SheetSide
        messages={messages}
        setHistory={setHistory}
        authUser={authUser}
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
                <p className="txt">{messageParser(message?.value)}</p>
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
