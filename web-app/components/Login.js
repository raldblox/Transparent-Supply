import Link from "next/link";
import React, { useContext } from "react";
import { Context } from "@/context";

const Login = ({ login }) => {
  const { user, setUser } = useContext(Context);
  const set = () => {
    setUser(login);
  };

  return (
    <button
      onClick={set}
      className={
        user == login
          ? "btn animate-pulse uppercase"
          : "btn uppercase"
      }
    >
      {login}
    </button>
  );
};

export default Login;
