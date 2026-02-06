import React from 'react'
import { Wallet } from 'lucide-react'
import Link from 'next/link'

const Header = ({onClick}) => {
  return (
    <header className="mb-8">
      {/* Header Desktop */}
      <div className="hidden sm:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl w-12 h-10">
            <Wallet className='text-white w-8 h-8'/>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">Easynizze</h1>
        </div>
        <Link href="/api/transacao">
          <button className='bg-green-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium text-sm sm:text-base'>
            Nova transação
          </button>
        </Link>
      </div>

      {/* Header Mobile */}
      <div className="sm:hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl w-10 h-8">
              <Wallet className='text-white w-6 h-6'/>
            </div>
            <h1 className="text-xl font-bold text-gray-800 bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">Easynizze</h1>
          </div>
          <Link href="/api/transacao">
            <button className='bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-all duration-300 font-medium text-sm'>
              Nova
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header