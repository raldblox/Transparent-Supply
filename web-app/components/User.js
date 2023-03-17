import React from 'react'
import Login from './Login'

const User = () => {
    return (
        <div className='flex flex-col p-4 bg-slate-800 rounded-2xl'>
            <h1 className='text-lg uppercase w-full text-center font-bold'>LOGIN AS</h1>
            <div className='flex justify-center items-center gap-5 mt-5'>
                <Login login="admin" />
                <Login login="driver" />
            </div>
        </div>
    )
}

export default User