import React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "../components/ui/drawer";
import { Button } from "../components/ui/button";
import { Menu, Plus, X } from "lucide-react";
import { sendMsgToGeminiAI } from "../geminiai";

export const DrawerComponent = ({
  setUserInput,
  setMessages,
  messages,
  history,
}) => {
  const handleHistoryQuery = async (e) => {
    const text = e.target.value;
    setUserInput("");
    setMessages([...messages, { text, isBot: false }]);
    const res = await sendMsgToGeminiAI(text);
    setMessages([
      ...messages,
      { text, isBot: false },
      { text: res, isBot: true },
    ]);
  };

  const newChat = async () => {
    await setMessages([
      {
        text: "Hi! ask your query.",
        isBot: true,
      },
    ]);
  };

  return (
    <Drawer>
      <DrawerTrigger className="hamburgerIcon">
        <Menu />
      </DrawerTrigger>
      <DrawerContent className="drawerContent">
        <DrawerHeader>
          <DrawerClose>
            <X className="drawerClose" />
          </DrawerClose>
          <DrawerDescription>
            <div className="sideBar">
              <div className="upperSide">
                <div className="upperSideTop">
                  <span className="brand">AI Proj</span>
                </div>
                <Button className="midBtn" onClick={newChat}>
                  <Plus />
                  New Chat
                </Button>
                <div className="upperSideBottom">
                  {history.map((e, index) => (
                    <Button
                      key={index}
                      className="query"
                      onClick={handleHistoryQuery}
                      value={e.text}
                    >
                      {e.text}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </DrawerDescription>
        </DrawerHeader>
        {/* <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};
