import React from 'react'
import { Wallet } from 'lucide-react'

const Header = () => {
  
  
  return (
    <header className="mb-8 flex justify-between items-center">
      <Wallet className='text-gray-800 p-0'/>
      <h1 className="text-4xl font-bold text-gray-800">Easynizze - controle financeiro</h1>
      <button className='bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-ease-in-out duration-500 font-medium'>Nova transação</button>
    </header>
  )
}

export default Header