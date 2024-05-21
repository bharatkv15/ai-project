import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Menu, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateMessages } from "../features/userquery/MessageSlice";

export const SheetSide = ({
  history,
  checkNewChatSession,
  setCheckSessionId,
}) => {
  const dispatch = useDispatch();
  const handleHistoryQuery = async (e) => {
    let result = history.find((obj) => obj?.id === e?.id);
    setCheckSessionId(result?.id);
    dispatch(updateMessages([...result.sessionHistory]));
  };

  const newChat = async () => {
    checkNewChatSession(true);
    await dispatch(updateMessages([]));
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
