import Login from "@/components/Login";
import { Context } from "@/context";
import contractAbi from "/libraries/contractABI.json";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";

const currentDeployment = "0xbbA72dc68B2B3Cc8fC643FD337BFb0DE5E484DB8";

export default function Home() {
  const [lock, setLock] = useState(false);
  const [crops, setCrops] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverAddr, setDriverAddr] = useState("");
  const [longitude1, setLongitude1] = useState("");
  const [latitude1, setLatitude1] = useState("");
  const [longitude2, setLongitude2] = useState("");
  const [latitude2, setLatitude2] = useState("");
  const [distance, setDistance] = useState("");
  const [forDelivery, setOutForDelivery] = useState(false);
  const [isFilled, setFilled] = useState(false);

  const [temp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [ethylene, setEthylene] = useState("");
  const [oxygen, setOxygen] = useState("");
  const [co2, setCo2] = useState("");
  const [onDelivery, setOnDelivery] = useState("");

  const { user, contractAddress, setContractAddress, account, admin, driver } =
    useContext(Context);

  const registerCrops = async () => {
    if (!contractAddress) {
      alert("Insert Contract Address");
      return;
    }
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
        let tx = await contract.registerCrop(crops);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash);
        } else {
          alert("Failed. Please try again.");
        }
        readStatus();
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const readStatus = async () => {
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
        let status = await contract.forDelivery();
        setOutForDelivery(status);
        let fill = await contract.isFilled();
        setFilled(fill);
        let deliveryId = await contract.getAssignedDelivery(account);
        console.log("deliveryId:", String(deliveryId));
        let onDelivery = await contract.activeDeliveries(deliveryId);
        console.log("onDelivery?:", Boolean(onDelivery));
        setOnDelivery(Boolean(onDelivery));
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const registerDriver = async () => {
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
        let tx = await contract.registerDriver(driverAddr, driverName, true);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash);
        } else {
          alert("Failed. Please try again.");
        }
        readStatus();
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const recordCrops = async () => {
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
        let tx = await contract.recordFoodStorageData(
          temp,
          humidity,
          ethylene,
          oxygen,
          co2
        );
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash);
        } else {
          alert("Failed. Please try again.");
        }
        readStatus();
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const startLocation = async () => {
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
        let tx = await contract.startLocationTracking(longitude1, latitude1);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash);
        } else {
          alert("Failed. Please try again.");
        }
        readStatus();
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const endLocation = async () => {
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
        let tx = await contract.endLocationTracking(
          longitude2,
          latitude2,
          distance
        );
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash);
        } else {
          alert("Failed. Please try again.");
        }
        readStatus();
      }
    } catch (error) {
      console.log("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  const toggleLock = () => {
    if (!contractAddress) {
      return;
    }
    if (lock) {
      setLock(false);
      setContractAddress("");
      setDriverAddr("");
    } else {
      setLock(true);
    }
  };

  const set = () => {
    if (contractAddress) {
      setContractAddress("");
    } else {
      setContractAddress(currentDeployment);
      setLock(true);
    }
  };

  useEffect(() => {
    readStatus();
  }, [admin, contractAddress, user]);

  return (
    <>
      {admin && (
        <section className="p-5">
          {user == "admin" && "Account is an authorized admin."}
          {user == "driver" && "Account is an authorized driver."}
          {user == "storage" && "Account is an authorized admin."}
        </section>
      )}
      <section className="grid grid-cols-4">
        <div className="flex flex-col col-span-4 gap-5 m-5 lg:col-span-2">
          <div className="flex gap-5 ">
            <input
              disabled={lock}
              type="text"
              className="w-full px-3 py-2 font-semibold text-left border"
              placeholder="Insert Contract Address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
            <button onClick={toggleLock}>{lock ? "UNLOCK" : "LOCK"}</button>
          </div>
          <button onClick={set} className="full-button">
            Use Current Deployment
          </button>
          {contractAddress && (
            <a
              target="_blank"
              href={`https://mumbai.polygonscan.com/address/${contractAddress}`}
              className="font-bold text-white underline uppercase hover:text-[blue]"
            >
              VIEW ON POLYGONSCAN
            </a>
          )}
        </div>
        <div className="flex items-center justify-center col-span-4 gap-5 p-5 border-t lg:border-l lg:col-span-2">
          <div className="flex flex-col justify-center gap-5">
            <h2 className="text-center">CONTROLLER</h2>
            <div className="flex gap-5">
              <Login login="admin" />
              <Login login="driver" />
              <Login login="storage" />
            </div>
          </div>
        </div>
      </section>
      <section className="">
        {user == "admin" && (
          <div className="p-5">
            <h1 className="text-lg font-bold uppercase">
              {isFilled && (
                <>
                  Food storage is now filled{" "}
                  {onDelivery ? "and on delivery." : "and out for delivery."}
                </>
              )}
            </h1>
            <div className="flex justify-between gap-2 mt-5">
              <input
                disabled={isFilled}
                value={crops}
                onChange={(e) => setCrops(e.target.value)}
                placeholder="Insert Storage Content (e.g. Brocolli, Cauliflower, Beef)"
                className="w-full px-3 py-2 font-semibold text-left border"
              />
              <button
                className="btn"
                onClick={registerCrops}
                disabled={isFilled}
              >
                Register
              </button>
            </div>
            <div className="flex gap-2 mt-5">
              <input
                disabled={!admin}
                value={driverAddr}
                onChange={(e) => setDriverAddr(e.target.value)}
                placeholder="Driver's Wallet"
                className="px-3 py-2 font-semibold text-left border"
              />
              <input
                disabled={!admin}
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Driver's Name"
                className="px-3 py-2 font-semibold text-left border"
              />
              <button className="btn" onClick={registerDriver}>
                Register
              </button>
            </div>
          </div>
        )}
        {user == "driver" && (
          <div className="p-5 border">
            <h1 className="text-lg font-bold uppercase">
              {forDelivery && "Food is now out for delivery."}
            </h1>
            <div className="flex justify-between w-auto gap-2 mt-5 max-w-none">
              <input
                disabled={!driver || forDelivery || onDelivery}
                value={longitude1}
                onChange={(e) => setLongitude1(e.target.value)}
                placeholder="Longitude (start)"
                className="flex-grow w-full px-3 py-2 font-semibold text-left border"
              />
              <input
                disabled={!driver || forDelivery || onDelivery}
                value={latitude1}
                onChange={(e) => setLatitude1(e.target.value)}
                placeholder="Latitude (start)"
                className="flex-grow w-full px-3 py-2 font-semibold text-left border"
              />
              <button className="btn" onClick={startLocation}>
                Start
              </button>
            </div>
            <div className="flex gap-2 mt-5">
              <input
                disabled={!onDelivery || !forDelivery}
                value={longitude2}
                onChange={(e) => setLongitude2(e.target.value)}
                placeholder="Longitude (end)"
                className="w-full px-3 py-2 font-semibold text-left border"
              />
              <input
                disabled={!onDelivery || !forDelivery}
                value={latitude2}
                onChange={(e) => setLatitude2(e.target.value)}
                placeholder="Latitude (end)"
                className="w-full px-3 py-2 font-semibold text-left border"
              />
              <input
                disabled={!onDelivery || !forDelivery}
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="Distance Travelled"
                className="w-full px-3 py-2 font-semibold text-left border"
              />
              <button className="btn" onClick={endLocation}>
                Finish
              </button>
            </div>
          </div>
        )}
        {user == "storage" && (
          <div className="p-5 border">
            <h1 className="text-lg font-bold uppercase">
              {isFilled && "Food storage is now filled. Start tracking now."}
            </h1>
            <div className="flex justify-between w-auto gap-2 mt-5 max-w-none">
              <input
                disabled={!isFilled}
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
                placeholder="Temperature"
                className="flex-grow w-full px-3 py-2 font-semibold text-left border"
              />
              <input
                disabled={!isFilled}
                value={humidity}
                onChange={(e) => setHumidity(e.target.value)}
                placeholder="Humidity"
                className="flex-grow w-full px-3 py-2 font-semibold text-left border"
              />
            </div>
            <div className="flex gap-2 mt-5">
              <input
                disabled={!isFilled}
                value={ethylene}
                onChange={(e) => setEthylene(e.target.value)}
                placeholder="Ethylene"
                className="w-full px-3 py-2 font-semibold text-left border"
              />
              <input
                disabled={!isFilled}
                value={oxygen}
                onChange={(e) => setOxygen(e.target.value)}
                placeholder="Oxygen"
                className="w-full px-3 py-2 font-semibold text-left border"
              />
              <input
                disabled={!isFilled}
                value={co2}
                onChange={(e) => setCo2(e.target.value)}
                placeholder="Carbon Dioxide"
                className="w-full px-3 py-2 font-semibold text-left border"
              />
              <button className="btn" onClick={recordCrops}>
                RECORD
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
