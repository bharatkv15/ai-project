import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Menu, Plus } from "lucide-react";
import { useState } from "react";

export const SheetSide = ({
  setUserInput,
  setMessages,
  messages,
  history,
  checkNewChatSession,
}) => {
  const handleHistoryQuery = async (e) => {
    //  const text = e.target.value;
    setUserInput("");
    //  setMessages([...messages, { text, isBot: false }]);

    let result = history.find((obj) => obj.index === e.index);
    console.log(e);
    setMessages([...result.sessionHistory]);
  };

  const newChat = async () => {
    checkNewChatSession(true);
    await setMessages([
      {
        text: "Hi! ask your query.",
        isBot: true,
      },
    ]);
  };

  const sessionHistoryButton = history.map((e, index) => (
    <Button
      key={index}
      className="query"
      onClick={() => handleHistoryQuery(index)}
      value={e.id}
    >
      {e.id}
      {/* {alert(index)} */}
    </Button>
  ));

  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet>
        <SheetTrigger className="hamburgerMenu" asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="sheetStyle">
          <SheetHeader>
            <SheetTitle className="screenTitle">AI Project</SheetTitle>
          </SheetHeader>
          <div className="sideBar">
            <div className="upperSide">
              <Button className="midBtn" onClick={newChat}>
                <Plus />
                New Chat
              </Button>
              <div className="upperSideBottom">
                {/* {history.map((e, index) => (
                  <Button
                    key={index}
                    className="query"
                    onClick={handleHistoryQuery}
                    value={e.text}
                  >
                    {e.text}
                  </Button>
                ))} */}
                {sessionHistoryButton}
                {/* {
                 history.map((e) => {
                  <Button
                  //  key={index}
                    className="query"
                    onClick={handleHistoryQuery}
                    value={e.id}
                  >
                    sdfgsd
                  </Button>
                 })
              } */}
                {/* 

                {history[0]?.text !== undefined ? <Button
                   // key={index}
                    className="query"
                    onClick={handleHistoryQuery}
                    value={history[0]?.text}
                  >
                    {history[0]?.text}
                  </Button>: null} */}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
