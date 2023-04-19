import React, { useContext, useEffect, useState } from "react";
import { networks } from "@/libraries/networks";
import { Context } from "@/context";
import { ethers } from "ethers";

const ConnectWallet = () => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { account, setAccount, setNetwork, balance, setBalance } =
    useContext(Context);

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
    // const infuraEndpoint = process.env.INFURA_MUMBAI;
    // const provider = new ethers.providers.JsonRpcProvider(infuraEndpoint);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balanceWei = await provider.getBalance(account);
    const balanceEth = ethers.utils.formatEther(balanceWei);
    console.log(balanceEth);
    setBalance(balanceEth);
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (account) {
      checkBalance();
    }
  }, [account]);

  return (
    <div>
      {account ? (
        <h5
          className={`px-3 py-1 bg-gray-700 border rounded-full ${
            connected && "text-blue-200"
          }`}
        >
          Connected to {account.slice(0, 6)}...{account.slice(-5)} |{" "}
          <span className="text-fuchsia-300">
            Balance:
            {balance.slice(0, 6)}
          </span>
        </h5>
      ) : (
        <button
          className="px-3 py-2 border rounded-lg hover:bg-gray-500"
          onClick={connectWallet}
        >
          {connecting ? "CONNECTING" : "CONNECT WALLET"}
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
