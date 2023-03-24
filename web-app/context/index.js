import React, { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = (props) => {
    const [account, setAccount] = useState("");
    const [network, setNetwork] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [user, setUser] = useState("");
    const value = {
        network,
        setNetwork,
        account,
        setAccount,
        user,
        setUser,
        contractAddress,
        setContractAddress,
    };

    return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
