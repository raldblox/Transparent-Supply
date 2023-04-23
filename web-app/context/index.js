import { ethers } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import contractAbi from "/libraries/contractABI.json";
import { networks } from "@/libraries/networks";

export const Context = createContext();

export const ContextProvider = (props) => {
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [network, setNetwork] = useState("");
  const [balance, setBalance] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [user, setUser] = useState("");
  const [admin, setAdmin] = useState(false);
  const [driver, setDriver] = useState(false);



  const connectWallet = async () => {
    setConnected(false);
    setConnecting(true);
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install Web3 Wallet like Metamask.");
        return;
      } else {
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setAccount(accounts[0].toLowerCase());
      setConnecting(false);
      setConnected(true);
    } catch (error) {
      console.log(error);
      setConnecting(false);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Connected account:", account);
      setAccount(account.toLowerCase());
      setConnected(true);
    } else {
      console.log("No authorized account found");
    }
    const chainId = await ethereum.request({ method: "eth_chainId" });
    setNetwork(networks[chainId]);

    ethereum.on("chainChanged", handleChainChanged);

    function handleChainChanged(_chainId) {
      window.location.reload();
    }
  };

  const switchNetwork = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x89" }],
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x89",
                  chainName: "Matic Mainnet",
                  rpcUrls: ["https://polygon-rpc.com/"],
                  nativeCurrency: {
                    name: "Matic",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://polygonscan.com/"],
                },
              ],
            });
          } catch (error) {
            console.log(error);
          }
        }
        console.log(error);
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };

  const checkBalance = async () => {
    if (!account) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balanceWei = await provider.getBalance(account);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    console.log(balanceEth);
    setBalance(balanceEth);
  };

  const checkAccess = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        console.log("Checking admins");
        if (!account) {
          return;
        }
        const isAdmin = await contract.isAuthorized(account);
        const isDriver = await contract.isDriver(account);
        console.log("Is Authorized?", isAdmin, ". Is Driver?", isDriver);
        setAdmin(isAdmin);
        setDriver(isDriver);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    checkBalance();
  }, [])

  useEffect(() => {
    if (contractAddress) {
      checkAccess();
    }
  }, [account, contractAddress])


  const value = {
    connected,
    setConnected,
    connecting,
    setConnecting,
    network,
    setNetwork,
    account,
    setAccount,
    balance,
    setBalance,
    user,
    setUser,
    contractAddress,
    setContractAddress,
    admin,
    setAdmin,
    driver,
    setDriver,
    switchNetwork
  };

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};
