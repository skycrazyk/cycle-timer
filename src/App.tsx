import { useState, useEffect, useCallback } from 'react'

type Timer = {
    id: string
    title: string
    duration: number
    repeat: number
}

const isValidTimer = (timer: Partial<Timer> | undefined) =>
    timer?.repeat && timer.repeat > 0

const stub = [
    {
        id: crypto.randomUUID(),
        title: 'First Timer',
        duration: 3,
        repeat: 2,
    },
    {
        id: crypto.randomUUID(),
        title: 'Second Timer',
        duration: 4,
        repeat: 1,
    },
    {
        id: crypto.randomUUID(),
        title: 'Third Timer',
        duration: 5,
        repeat: 3,
    },
] satisfies Timer[]

enum State {
    stopped = 'stopped',
    running = 'running',
    paused = 'paused',
}

export const App = () => {
    const [timers] = useState<Timer[]>(stub)
    const [timer, setTimer] = useState<Timer>()
    const [state, setState] = useState(State.stopped)
    const [tickId, setTickId] = useState<number>()
    const [timePassed, setTimePassed] = useState(0)
    const [repeat, setRepeat] = useState(0)
    const start = useCallback(() => setState(State.running), [])
    const pause = useCallback(() => setState(State.paused), [])
    const stop = useCallback(() => setState(State.stopped), [])

    const watch = useCallback(() => {
        setTickId(
            setTimeout(() => {
                setTimePassed((timePassed) => timePassed + 1)
                watch()
            }, 1000)
        )
    }, [])

    useEffect(() => {
        if (timePassed === 0 || !timer) return

        if (timePassed === timer.duration) {
            if (repeat === timer.repeat - 1) {
                const timerIndex = timers.findIndex((t) => t === timer)

                if (timerIndex === -1) {
                    setState(State.stopped)
                    return
                }

                const nextTimer = timers[timerIndex + 1]

                if (!isValidTimer(nextTimer)) {
                    setState(State.stopped)
                    return
                }

                setTimer(nextTimer)
            } else {
                setTimePassed(0)
                setRepeat((repeat) => repeat + 1)
            }
        }
    }, [timePassed])

    useEffect(() => {
        switch (state) {
            case State.running: {
                if (timers.length === 0) break

                const nextTimer = timer || timers[0]

                if (!isValidTimer(nextTimer)) break

                setTimer(nextTimer)
                watch()

                break
            }
            case State.paused:
                clearTimeout(tickId)
                break
            case State.stopped:
                clearTimeout(tickId)
                setTimer(undefined)
                break
            default:
            // nothing
        }
    }, [state])

    useEffect(() => {
        setTimePassed(0)
        setRepeat(0)
    }, [timer])

    return (
        <>
            <h1>Timers</h1>
            <div>current timer timePassed: {timePassed}</div>
            <div>state: {state}</div>
            <ul>
                {timers.map((t) => (
                    <li
                        style={{
                            ...(t === timer && { background: '#8EB69B' }),
                        }}
                    >
                        {t.title}, duration: {t.duration}, repeat: {t.repeat}
                    </li>
                ))}
            </ul>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={start}>Start</button>
                <button onClick={pause}>Pause</button>
                <button onClick={stop}>Stop</button>
            </div>
        </>
    )
}
