import React, { useContext, useEffect, useState } from 'react'
import { Context } from '@/context';

const Dashboard = () => {
    const [input, setInput] = useState("");
    const [input1, setInput1] = useState("");
    const { account, setAccount, network, setNetwork, user } =
        useContext(Context);

    useEffect(() => {
        setInput("");
        setInput1("");
    }, [user])

    return (
        <>
            {user == "admin" &&
                <div className='border p-10 rounded-2xl'>
                    <h1 className='uppercase font-bold'>Registration</h1>
                    <div className='flex mt-5 gap-2 justify-between'>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Insert Storage Content (e.g. Brocolli, Cauliflower, Beef)"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <button className='btn' >
                            Register
                        </button>
                    </div>
                    <div className='flex mt-5 gap-2'>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Driver's Wallet"
                            className="px-3 py-2 text-left border font-semibold"
                        />
                        <input
                            value={input1}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Driver's Name"
                            className="px-3 py-2 text-left border font-semibold"
                        />
                        <button className='btn' >
                            Register
                        </button>
                    </div>
                </div>}
            {user == "driver" &&
                <div className='border p-10 rounded-2xl'>
                    <h1 className='uppercase font-bold'>Delivery</h1>
                    <div className='flex mt-5 gap-2 justify-between'>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Longitude"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <input
                            value={input1}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Latitude"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <button className='btn' >
                            START
                        </button>
                    </div>
                    <div className='flex mt-5 gap-2'>
                        <input
                            value={input}
                            disabled={true}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Longitude"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <input
                            disabled={true}
                            value={input1}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Latitude"
                            className="px-3 py-2 text-left border w-full font-semibold"
                        />
                        <button className='btn' >
                            FINISH
                        </button>
                    </div>
                </div>}
        </>
    )
}

export default Dashboard