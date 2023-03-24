import React, { useContext, useEffect, useState } from 'react'
import { Context } from '@/context';
import contractAbi from "/libraries/contractABI.json";
import { ethers } from 'ethers';


const Dashboard = () => {
    const [crops, setCrops] = useState("");
    const [admin, setAdmin] = useState(false);
    const [driver, setDriver] = useState(false);
    const [driverName, setDriverName] = useState("");
    const [driverAddr, setDriverAddr] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [distance, setDistance] = useState("");
    const { user, contractAddress, account } = useContext(Context);

    const registerCrops = async () => {
        if (!contractAddress) {
            alert("Insert Contract Address")
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
                    alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash)
                } else {
                    alert("Failed. Please try again.");
                }
            }
        } catch (error) {
            console.log("Error:", error);
            alert("Something went wrong. Please try again later.");
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
                    alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash)
                } else {
                    alert("Failed. Please try again.");
                }
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
                let tx = await contract.startLocationTracking(longitude, latitude);
                const receipt = await tx.wait();
                if (receipt.status === 1) {
                    alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash)
                } else {
                    alert("Failed. Please try again.");
                }
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
                let tx = await contract.endLocationTracking(longitude, latitude, distance);
                const receipt = await tx.wait();
                if (receipt.status === 1) {
                    alert(`TX: https://mumbai.polygonscan.com.com/tx/` + tx.hash)
                } else {
                    alert("Failed. Please try again.");
                }
            }
        } catch (error) {
            console.log("Error:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    const checkAdmin = async () => {
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
        checkAdmin();
        setCrops("");
        setDriverName("");
    }, [user])

    return (
        <>
            {admin && user == "admin" && "Account is an authorized admin."}
            {admin && user == "driver" && "Account is an authorized driver."}
            {user == "admin" &&
                <div className='border p-10 rounded-2xl'>
                    <h1 className='uppercase font-bold text-lg'>Register Foods/Crops/Drivers</h1>
                    <div className='flex mt-5 gap-2 justify-between'>
                        <input
                            disabled={!admin}
                            value={crops}
                            onChange={(e) => setCrops(e.target.value)}
                            placeholder="Insert Storage Content (e.g. Brocolli, Cauliflower, Beef)"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <button className='btn' onClick={registerCrops}>
                            Register
                        </button>
                    </div>
                    <div className='flex mt-5 gap-2'>
                        <input
                            disabled={!admin}
                            value={driverAddr}
                            onChange={(e) => setDriverAddr(e.target.value)}
                            placeholder="Driver's Wallet"
                            className="px-3 py-2 text-left border font-semibold"
                        />
                        <input
                            disabled={!admin}
                            value={driverName}
                            onChange={(e) => setDriverName(e.target.value)}
                            placeholder="Driver's Name"
                            className="px-3 py-2 text-left border font-semibold"
                        />
                        <button className='btn' onClick={registerDriver}>
                            Register
                        </button>
                    </div>
                </div>}
            {user == "driver" &&
                <div className='border p-10 rounded-2xl'>
                    <h1 className='uppercase font-bold text-lg'>For Delivery DRIVER</h1>
                    <div className='flex mt-5 gap-2 justify-between'>
                        <input
                            disabled={!driver}
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="Longitude"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <input
                            disabled={!driver}
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="Latitude"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <button className='btn' onClick={startLocation}>
                            Start
                        </button>
                    </div>
                    <div className='flex  mt-5 gap-2'>
                        <input
                            disabled={!driver}
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="Longitude"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <input
                            disabled={!driver}
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="Latitude"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <input
                            disabled={!driver}
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            placeholder="Distance Travelled"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <button className='btn' onClick={endLocation}>
                            Finish
                        </button>
                    </div>
                </div>}
        </>
    )
}

export default Dashboard