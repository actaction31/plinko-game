import { Coin, CurrencyDollarSimple, Smiley } from 'phosphor-react'
import { ChangeEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth'

import { LinesType } from '../../@types'

interface PlinkoBetActions {
  onRunBet: (betValue: number) => void
  onChangeLines: (lines: LinesType) => void
  inGameBallsCount: number
}

export function BetActions({
  onRunBet,
  onChangeLines,
  inGameBallsCount
}: PlinkoBetActions) {
  const isLoading = useAuthStore(state => state.isWalletLoading)
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const decrementCurrentBalance = useAuthStore(state => state.decrementBalance)
  const isAuth = useAuthStore(state => state.isAuth)
  const [betValue, setBetValue] = useState(0)
  const maxLinesQnt = 16
  const linesOptions: number[] = []
  for (let i = 16; i <= maxLinesQnt; i++) {
    linesOptions.push(i)
  }

  function handleChangeBetValue(e: ChangeEvent<HTMLInputElement>) {
    if (!isAuth || isLoading) return
    e.preventDefault()
    const value = +e.target.value
    const newBetValue = value >= currentBalance ? currentBalance : value
    setBetValue(newBetValue)
  }

  function handleChangeLines(e: ChangeEvent<HTMLSelectElement>) {
    if (!isAuth || isLoading) return

    onChangeLines(Number(e.target.value) as LinesType)
  }

  function handleHalfBet() {
    if (!isAuth || isLoading) return
    const value = betValue / 2
    const newBetvalue = value <= 0 ? 0 : Math.floor(value)
    setBetValue(newBetvalue)
  }

  function handleDoubleBet() {
    if (!isAuth || isLoading) return
    const value = betValue * 2

    if (value >= currentBalance) {
      setBetValue(currentBalance)
      return
    }

    const newBetvalue = value <= 0 ? 0 : Math.floor(value)
    setBetValue(newBetvalue)
  }

  function handleMaxBet() {
    if (!isAuth || isLoading) return
    setBetValue(currentBalance)
  }

  async function handleRunBet() {
    // if (!isAuth || isLoading) return
    if (inGameBallsCount >= 15) return
    if (betValue > currentBalance) {
      setBetValue(currentBalance)
      return
    }
    console.log(betValue)
    onRunBet(betValue)
    if (betValue <= 0) return
    await decrementCurrentBalance(betValue)
  }

  return (
    <div className="relative h-1/2 w-full flex-1 py-[32px] px-[16px]">
      <span className="absolute left-4 top-0 mx-auto text-xs font-bold text-text md:text-base">
        *Balls in play {inGameBallsCount}/15
      </span>

      <div className="flex h-full flex-col gap-[16px] rounded-md bg-primary p-[16px] text-text md:justify-between">
        <div className="flex flex-col gap-[8px]">
          <div className="flex flex-row items-stretch gap-[4px] md:flex-col">
            <div className="w-full text-sm font-bold md:text-base">
              <div className="flex flex-1 items-stretch justify-between">
                <span>Bet amount</span>
                <div className="flex items-center gap-[4px]">
                  <div className="rounded-full bg-purpleDark p-[2px]">
                    <CurrencyDollarSimple weight="bold" />
                  </div>
                  <span>{betValue.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-stretch justify-center shadow-md">
                <input
                  type="number"
                  min={0}
                  max={currentBalance}
                  onChange={handleChangeBetValue}
                  value={betValue}
                  className="w-full rounded-bl-md rounded-tl-md border-2 border-secondary bg-background p-[10px] px-[16px] font-bold transition-colors placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none md:p-[8px]"
                />
                <button
                  onClick={handleHalfBet}
                  className="relative border-2 border-transparent bg-secondary p-[10px] px-[12px] transition-colors after:absolute after:top-[calc(50%_-_8px)] after:right-0 after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-purple focus:outline-none md:p-[8px]"
                >
                  ½
                </button>
                <button
                  onClick={handleDoubleBet}
                  className="relative border-2 border-transparent bg-secondary p-[10px] px-[12px] transition-colors after:absolute after:top-[calc(50%_-_8px)] after:right-0 after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-purple focus:outline-none md:p-[8px]"
                >
                  2x
                </button>
                <button
                  onClick={handleMaxBet}
                  className="rounded-br-md rounded-tr-md border-2 border-transparent bg-secondary p-[8px] px-[12px] text-xs transition-colors hover:bg-secondary/80 focus:border-purple focus:outline-none"
                >
                  max
                </button>
              </div>
            </div>

            <button
              onClick={handleRunBet}
              disabled={isLoading}
              className="block rounded-md bg-purple px-[8px] py-[16px] text-sm font-bold leading-none text-background transition-colors hover:bg-purpleDark focus:outline-none focus:ring-1 focus:ring-purple focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:hidden"
            >
              Apostar
            </button>
          </div>
          <select
            disabled={inGameBallsCount > 0}
            onChange={handleChangeLines}
            defaultValue={16}
            className="w-full rounded-md border-[8px] border-secondary bg-background py-[8px] px-[16px] font-bold transition-all placeholder:font-bold placeholder:text-text focus:border-purple focus:outline-none disabled:line-through disabled:opacity-80"
            id="lines"
          >
            {linesOptions.map(line => (
              <option key={line} value={line}>
                {line} Linhas
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRunBet}
          disabled={isLoading}
          className="hidden rounded-md bg-purple px-[24px] py-[20px] font-bold leading-none text-background transition-colors hover:bg-purpleDark focus:outline-none focus:ring-1 focus:ring-purple focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:visible md:block"
        >
          Apostar
        </button>
        <div className="flex flex-col items-center gap-[16px] text-sm font-bold text-text md:items-start lg:absolute lg:-bottom-20 lg:left-4">
          <span>
            Se se divertiu jogando e quiser ajudar de alguma forma,
            <span className="flex items-center gap-[8px]">
              doe 1 real pra o desenvolvedor clicando abaixo.
              <Smiley weight="fill" />
            </span>
          </span>
          <Link
            to="/contribute"
            className="flex items-center gap-[8px] rounded-md bg-background p-[8px] font-bold transition-colors hover:bg-primary/50 lg:bg-primary"
          >
            DOAR 1 REAL <Coin />
          </Link>
        </div>
      </div>
    </div>
  )
}
