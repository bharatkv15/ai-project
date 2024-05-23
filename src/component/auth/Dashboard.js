import React from "react";

export const Dashboard = ({ authUser }) => {
  return (
    <div className="dashboard">
      <div className="dashHeading">
        {" "}
        <h3>
          <b>Dashboard</b>
        </h3>
      </div>
      <div className="dashUserData">
        <p>User Email: {authUser?.email}</p>
      </div>
    </div>
  );
};
