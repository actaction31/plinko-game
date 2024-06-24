import React, { useCallback, useEffect, useState } from 'react'
import {
    Bodies,
    Body,
    Composite,
    Engine,
    Events,
    IEventCollision,
    Render,
    Runner,
    World
} from 'matter-js';

import { config } from '../../config'
import { getMultiplierByLinesQnt } from '../../config/multipliers'
import { useAuthStore } from '../../store/auth'
import { useGameStore } from '../../store/game'

import { random } from '../../utils/random'
import { LinesType, MultiplierValues } from '../../@types'

import { BetActions } from '../../components/BetActions'
import { PlinkoGameBody } from '../../components/GameBody'
import { MultiplierHistory } from '../../components/MultiplierHistory'

const Home = () => {
    // #region States
    const incrementCurrentBalance = useAuthStore(state => state.incrementBalance)
    const engine = Engine.create()
    const [lines, setLines] = useState<LinesType>(16)
    const inGameBallsCount = useGameStore(state => state.gamesRunning)
    const incrementInGameBallsCount = useGameStore(
        state => state.incrementGamesRunning
    )
    const decrementInGameBallsCount = useGameStore(
        state => state.decrementGamesRunning
    )
    const [lastMultipliers, setLastMultipliers] = useState<number[]>([])
    const {
        pins: pinsConfig,
        colors,
        ball: ballConfig,
        engine: engineConfig,
        world: worldConfig
    } = config

    const worldWidth: number = worldConfig.width
    const worldHeight: number = worldConfig.height
    // #endregion

    useEffect(() => {
        engine.gravity.y = engineConfig.engineGravity
        const element = document.getElementById('plinko')
        const render = Render.create({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            element: element!,
            bounds: {
                max: {
                    y: worldHeight,
                    x: worldWidth
                },
                min: {
                    y: 0,
                    x: 0
                }
            },
            options: {
                background: colors.background,
                hasBounds: true,
                width: worldWidth,
                height: worldHeight,
                wireframes: false
            },
            engine
        })
        const runner = Runner.create()
        Runner.run(runner, engine)
        Render.run(render)
        return () => {
            World.clear(engine.world, true)
            Engine.clear(engine)
            render.canvas.remove()
            render.textures = {}
        }
    }, [lines])

    const pins: Body[] = []

    for (let l = 0; l < lines; l++) {
        const linePins = pinsConfig.startPins + l
        const lineWidth = linePins * pinsConfig.pinGap
        for (let i = 0; i < linePins; i++) {
            const pinX =
                worldWidth / 2 -
                lineWidth / 2 +
                i * pinsConfig.pinGap +
                pinsConfig.pinGap / 2

            const pinY =
                worldWidth / lines + l * pinsConfig.pinGap + pinsConfig.pinGap

            const pin = Bodies.circle(pinX, pinY, pinsConfig.pinSize, {
                label: `pin-${i}`,
                render: {
                    fillStyle: '#F5DCFF'
                },
                isStatic: true
            })
            pins.push(pin)
        }
    }

    function addInGameBall() {
        // if (inGameBallsCount > 15) return
        incrementInGameBallsCount()
    }

    function removeInGameBall() {
        decrementInGameBallsCount()
    }

    const addBall = useCallback(
        (ballValue: number) => {
            addInGameBall()

            const minBallX =
                worldWidth / 2 - pinsConfig.pinSize * 3 + pinsConfig.pinGap + 10
            const maxBallX =
                worldWidth / 2 -
                pinsConfig.pinSize * 3 -
                pinsConfig.pinGap +
                pinsConfig.pinGap / 2 - 10

            const ballX = random(minBallX, maxBallX)
            // const ballX = 266.61893078002834;
            console.log(ballX)
            const ballColor = ballValue <= 0 ? colors.text : colors.purple
            const ball = Bodies.circle(ballX, 20, ballConfig.ballSize, {
                restitution: 1,
                friction: 0,
                label: `ball-${ballValue}`,
                id: new Date().getTime(),
                frictionAir: 0.05,
                collisionFilter: {
                    group: -1
                },
                render: {
                    fillStyle: ballColor
                },
                isStatic: false
            })
            Composite.add(engine.world, ball)
        },
        [lines]
    )

    const leftWall = Bodies.rectangle(
        worldWidth / 3 - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap + 25,
        worldWidth / 2 - pinsConfig.pinSize,
        worldWidth,
        40,
        {
            angle: 90,
            render: {
                // visible: false
            },
            isStatic: true
        }
    )

    const leftWall1 = Bodies.rectangle(
        pinsConfig.pinGap - 15,
        worldWidth / 2 - pinsConfig.pinSize,
        worldWidth,
        40,
        {
            angle: 90 * Math.PI / 180,
            render: {
                // visible: false
            },
            isStatic: true
        }
    )

    const rightWall = Bodies.rectangle(
        worldWidth - pinsConfig.pinSize * pinsConfig.pinGap - pinsConfig.pinGap - pinsConfig.pinGap / 2 + 30,
        worldWidth / 2 - pinsConfig.pinSize,
        worldWidth * 1,
        40,
        {
            angle: -90,
            render: {
                // visible: false
            },
            isStatic: true
        }
    )
    
    const rightWall1 = Bodies.rectangle(
        worldWidth - 15,
        worldWidth / 2 - pinsConfig.pinSize,
        worldWidth * 1,
        40,
        {
            angle: 90 * Math.PI / 180,
            render: {
                // visible: false
            },
            isStatic: true
        }
    )

    const floor = Bodies.rectangle(0, worldWidth - 40, worldWidth * 10, 40, {
        label: 'block-1',
        render: {
            // visible: false,
            fillStyle: 'rgba(0,0,0,0.6)'
        },
        isStatic: true
    })

    const multipliers = getMultiplierByLinesQnt(lines)

    const multipliersBodies_easy: Body[] = []
    const multipliersBodies_medium: Body[] = []
    const multipliersBodies_diff: Body[] = []

    let lastMultiplierX_easy: number, lastMultiplierX_medium: number, lastMultiplierX_diff: number

    lastMultiplierX_easy = lastMultiplierX_medium = lastMultiplierX_diff = worldWidth / 2 - (pinsConfig.pinGap / 2) * lines - pinsConfig.pinGap

    multipliers.forEach(multiplier => {
        const blockSize = 30 // height and width
        const multiplierBody = Bodies.rectangle(
            lastMultiplierX_easy + 30,
            worldWidth / lines + lines * pinsConfig.pinGap + pinsConfig.pinGap,
            blockSize,
            blockSize,
            {
                label: multiplier.label,
                isStatic: true,
                render: {
                    sprite: {
                        xScale: 1.5,
                        yScale: 1.2,
                        texture: multiplier.img
                    }
                }
            }
        )
        lastMultiplierX_easy = multiplierBody.position.x
        multipliersBodies_easy.push(multiplierBody)
    })

    multipliers.forEach(multiplier => {
        const blockSize = 30 // height and width
        const multiplierBody = Bodies.rectangle(
            lastMultiplierX_medium + 30,
            worldWidth / lines + lines * pinsConfig.pinGap + pinsConfig.pinGap + 25,
            blockSize,
            blockSize,
            {
                label: multiplier.label,
                isStatic: true,
                render: {
                    sprite: {
                        xScale: 1.5,
                        yScale: 1.2,
                        texture: multiplier.img
                    }
                }
            }
        )
        lastMultiplierX_medium = multiplierBody.position.x
        multipliersBodies_medium.push(multiplierBody)
    })

    multipliers.forEach(multiplier => {
        const blockSize = 30 // height and width
        const multiplierBody = Bodies.rectangle(
            lastMultiplierX_diff + 30,
            worldWidth / lines + lines * pinsConfig.pinGap + pinsConfig.pinGap + 50,
            blockSize,
            blockSize,
            {
                label: multiplier.label,
                isStatic: true,
                render: {
                    sprite: {
                        xScale: 1.5,
                        yScale: 1.2,
                        texture: multiplier.img
                    }
                }
            }
        )
        lastMultiplierX_diff = multiplierBody.position.x
        multipliersBodies_diff.push(multiplierBody)
    })

    Composite.add(engine.world, [
        ...pins,
        ...multipliersBodies_easy,
        ...multipliersBodies_medium,
        ...multipliersBodies_diff,
        leftWall,
        leftWall1,
        rightWall,
        rightWall1,
        floor
    ])

    function bet(betValue: number) {
        addBall(betValue)
    }

    async function onCollideWithMultiplier(ball: Body, multiplier: Body) {
        ball.collisionFilter.group = 2
        World.remove(engine.world, ball)
        removeInGameBall()
        const ballValue = ball.label.split('-')[1]
        const multiplierValue = +multiplier.label.split('-')[1] as MultiplierValues

        setLastMultipliers(prev => [multiplierValue, prev[0], prev[1], prev[2]])

        if (+ballValue <= 0) return

        const newBalance = +ballValue * multiplierValue
        await incrementCurrentBalance(newBalance)
    }
    async function onBodyCollision(event: IEventCollision<Engine>) {
        const pairs = event.pairs
        for (const pair of pairs) {
            const { bodyA, bodyB } = pair
            if (bodyB.label.includes('ball') && bodyA.label.includes('block')){
                await onCollideWithMultiplier(bodyB, bodyA)
            }
        }
    }

    // Events.on(engine, 'collisionActive', onBodyCollision)
    Events.on(engine, 'collisionStart', onBodyCollision)

    return (
        <div className="flex h-fit flex-col-reverse items-center justify-center gap-[16px] md:flex-row">
            <BetActions
                inGameBallsCount={inGameBallsCount}
                onChangeLines={setLines}
                onRunBet={bet}
            />
            <MultiplierHistory multiplierHistory={lastMultipliers} />
            <div className="flex flex-1 items-center justify-center">
                <PlinkoGameBody />
            </div>
        </div>
    )
}

export default Home;