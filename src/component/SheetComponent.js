import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { sendMsgToGeminiAI } from "../geminiai";
import { Menu, Plus } from "lucide-react";

export const SheetSide = ({ setUserInput, setMessages, messages, history }) => {
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
    <div className="grid grid-cols-2 gap-2">
      <Sheet>
        <SheetTrigger className="hamburgerMenu" asChild>
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="sheetStyle">
          <SheetHeader>
            <SheetTitle className='screenTitle'>AI Project</SheetTitle>
          </SheetHeader>
          <div className="sideBar">
            <div className="upperSide">
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
        </SheetContent>
      </Sheet>
    </div>
  );
};
