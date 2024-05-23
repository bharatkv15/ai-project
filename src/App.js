import "./App.css";
import { ChatComponent } from "./component/ChatComponent";
import { Navbar } from "./component/Navbar";
import { SignIn } from "./component/auth/SignIn";
import { SignUp } from "./component/auth/SignUp";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { Dashboard } from "./component/auth/Dashboard";

function App() {
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const RequiredAuth = ({ children }) => {
    return authUser ? children : <Navigate to="/" />;
  };

  const RequiredAuthSignInAndRegister = ({ children }) => {
    return authUser ? <Navigate to="/" /> : children;
  };

  return (
    <>
      <Navbar authUser={authUser} />
      <Routes>
        <Route path="/" element={<ChatComponent authUser={authUser} />} />
        <Route path="/signin" element={<RequiredAuthSignInAndRegister><SignIn /></RequiredAuthSignInAndRegister>} />
        <Route path="/register" element={<RequiredAuthSignInAndRegister><SignUp /></RequiredAuthSignInAndRegister>} />
        <Route path="/dashboard" element={<RequiredAuth><Dashboard authUser={authUser} /></RequiredAuth>} />
      </Routes>
    </>
  );
}

export default App;
