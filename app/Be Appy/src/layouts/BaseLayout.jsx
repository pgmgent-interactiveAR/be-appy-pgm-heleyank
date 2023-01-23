import React, { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import { ErrorContext } from "../App";
import Error from "../components/Errors/Error";

const BaseLayout = () => {
  const [error, setError] = useContext(ErrorContext);
  return (
    <div className="primary-background">
      {error ? <Error /> : ""}
      <Outlet />
    </div>
  );
};

export default BaseLayout;
