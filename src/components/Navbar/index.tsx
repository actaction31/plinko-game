import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { CurrencyDollarSimple } from 'phosphor-react'

import { useAuthStore } from '../../store/auth'
import { useGameStore } from '../../store/game'

export function Navbar() {
  const inGameBallsCount = useGameStore((state: any) => state.gamesRunning)
  const currentBalance = useAuthStore((state: any) => state.wallet.balance)
  const isAuth = useAuthStore((state: any) => state.isAuth)

  return (
    <nav className="sticky top-0 z-50 bg-primary px-[16px] shadow-lg min-h-[60px]">
      <div
        className={classNames(
          'mx-auto flex h-16 w-full max-w-[1400px] items-center',
          {
            'justify-between': isAuth,
            'justify-center': !isAuth
          }
        )}
      >
        <Link to={inGameBallsCount ? '#!' : '/'} className='text-white text-[32px]'>
          PLINKO
        </Link>
        {isAuth && (
          <div className="flex items-stretch gap-[16px] font-bold uppercase text-white md:text-lg">
            <span className="rounded-full bg-purpleDark p-[4px]">
              <CurrencyDollarSimple weight="bold" />
            </span>
            <span className="text-[24px]">{currentBalance.toFixed(2)}</span>
          </div>
        )}
      </div>
    </nav>
  )
}
