import { Context } from '@/context';
import React, { useContext } from 'react'

const Nav = () => {
    const { account, balance, connectWallet, connecting, connected } = useContext(Context);
    console.log(balance)
    return (
        <nav>
            {account ? (
                <h5
                    className={`px-3 py-1 bg-gray-700 border ${connected && "text-blue-200"
                        }`}
                >
                    ACCOUNT: {account.slice(0, 6)}...{account.slice(-5)}
                    <span className="pl-2 ml-2 border-l text-fuchsia-300">
                        Balance: {balance.slice(0, 3)} $MATIC
                    </span>
                </h5>
            ) : (
                <button
                    className="px-3 py-2 border hover:bg-gray-500"
                    onClick={connectWallet}
                >
                    {connecting ? "CONNECTING" : "CONNECT WALLET"}
                </button>
            )}
        </nav>
    )
}

export default Nav