import React from 'react'
import Login from './Login'

const User = () => {
    return (
        <div className='flex flex-col p-4 bg-slate-800 rounded-2xl'>
            <div className='flex justify-center items-center gap-5'>
                <Login login="admin" />
                <Login login="driver" />
                {/* <Login login="history" /> */}
            </div>
        </div>
    )
}

export default User