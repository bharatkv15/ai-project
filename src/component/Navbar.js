import * as React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "../components/ui/button";

export const Navbar = ({ authUser }) => {
  const [state, setState] = React.useState(false);

  const userSignOut = () => {
    signOut(auth).then(() => {
      alert("User signout successfully")
      console.log("User signout successfully");
    }).catch(error => {
      console.log(error);
    })
  };

  return (
    <nav className="bg-purple w-full border-b md:border-0">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:flex md:px-8">
        <div className="headingClass flex items-center justify-between py-3 md:py-5 md:block">
          <Link to="/">
            <h1 className="text-3xl font-bold text-white">AI Project</h1>
          </Link>
          <div className="md:hidden">
            <button
              className="text-gray-700 outline-none p-2 rounded-md focus:border-gray-400 focus:border"
              onClick={() => setState(!state)}
            >
              <Menu />
            </button>
          </div>
        </div>
        <div
          className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-end items-center space-y-8 md:flex md:space-x-6 md:space-y-0">
            <li className="text-white hover:text-gray-400">
              <Link to="/">Home</Link>
            </li>
            {authUser ? (
              <li className="text-white hover:text-gray-400">
                <Link to="/dashboard">Dashboard</Link>
              </li>
            ) : null}
            <li className="text-white hover:text-gray-400">
              {authUser ? (
                <>
                  <b>{authUser.email}</b>
                  <Button onClick={userSignOut}>Sign Out</Button>
                </>
              ) : (
                <>
                  <Link to="/signin">SignIn/Register</Link>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
