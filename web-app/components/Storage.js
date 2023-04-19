import React, { useContext, useState } from "react";
import { Context } from "@/context";

const Storage = () => {
  const [lock, setLock] = useState(false);
  const toggleLock = () => {
    if (lock) {
      setLock(false);
    } else {
      setLock(true);
    }
  };
  const set = () => {
    if (contractAddress) {
      setContractAddress("");
    } else {
      setContractAddress("0xbbA72dc68B2B3Cc8fC643FD337BFb0DE5E484DB8");
      setLock(true);
    }
  };
  const { contractAddress, setContractAddress } = useContext(Context);

  

  return (
    <div className="flex flex-col items-center gap-2">
      <a
        target="_blank"
        href={`https://mumbai.polygonscan.com/address/${contractAddress}`}
        className={`mb-5 text-xl font-bold uppercase hover:underline ${
          contractAddress && "text-[blue] text-2xl hover:text-white underline"
        }`}
      >
        STORAGE CONTRACT
      </a>
      <p>BALANCE: </p>
      <div className="flex gap-2">
        <input
          disabled={lock}
          type="text"
          className="text-center"
          placeholder="Insert Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
        <button onClick={toggleLock}>{lock ? "LOCKED" : "LOCK"}</button>
      </div>
      <button onClick={set} className="w-full">
        Use Current Deployment
      </button>
    </div>
  );
};

export default Storage;
