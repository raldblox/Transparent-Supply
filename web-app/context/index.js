import React, { createContext, useState } from "react";
import useLocalStorage from "use-local-storage";

export const Context = createContext();

export const ContextProvider = (props) => {
    const [account, setAccount] = useState("");
    const [network, setNetwork] = useState("");
    const [user, setUser] = useState("");
    const value = {
        network,
        setNetwork,
        account,
        setAccount,
        user,
        setUser,
    };

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
