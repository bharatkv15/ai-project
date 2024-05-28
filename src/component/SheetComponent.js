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
import { doc, getDoc } from "firebase/firestore/lite";
import { db } from "../firebase";
import { useEffect } from "react";

export const SheetSide = ({
  messages,
  setHistory,
  authUser,
  history,
  checkNewChatSession,
  setCheckSessionId,
}) => {
  const dispatch = useDispatch();

  const checkUserHistory = async () => {
    if (authUser) {
      const userDocRef = await doc(db, "users", authUser.uid);
      const docSnap = await getDoc(userDocRef);
      let docSnapArray = [];
      if (docSnap.exists()) {
        let userDocSnap = docSnap.data()
        for (const obj in userDocSnap) {
          docSnapArray.push(userDocSnap[obj]);
        }
        setHistory(docSnapArray)
      } else {
        console.log("No such document!");
      }
    }
  };

  useEffect(() => {
    checkUserHistory();
  }, [messages, authUser]);

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
