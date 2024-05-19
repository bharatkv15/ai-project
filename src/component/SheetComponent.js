import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Menu, Plus } from "lucide-react";

export const SheetSide = ({
  setMessages,
  history,
  checkNewChatSession,
  setCheckKey,
}) => {
  const handleHistoryQuery = async (e) => {
    let result = history.find(
      (obj) => obj.sessionHistory[0]?.key === e.sessionHistory[0]?.key
    );
    setCheckKey(result.sessionHistory[0].key);
    setMessages([...result.sessionHistory]);
  };

  const newChat = async () => {
    checkNewChatSession(true);
    await setMessages([]);
  };

  const sessionHistoryButton = history.map((e, index) => (
    <Button
      key={index}
      className="query"
      onClick={() => handleHistoryQuery(e)}
      value={e?.sessionHistory[0]?.key}
    >
      {e?.sessionHistory[0]?.key}
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
              <div className="upperSideBottom">{sessionHistoryButton}</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
