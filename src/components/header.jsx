import React from 'react'
import { Wallet } from 'lucide-react'
import Link from 'next/link'

const Header = ({onClick}) => {
  
  
  return (
    <header className="mb-8 flex justify-between items-center ">
      <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl w-12 h-10">
        <Wallet className='text-white w-8 h-8'/>
        
      </div>
      <h1 className="text-4xl font-bold text-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">Easynizze</h1>
      <Link href="/api/transacao">
        <button className='bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-ease-in-out duration-500 font-medium'>Nova transação</button>
      </Link>
    </header>
  )
}

export default Header