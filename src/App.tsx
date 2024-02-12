import { useState, useEffect } from 'react'

type Timer = {
    id: string
    title: string
    duration: number
    repeat: number
}

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
        repeat: 0,
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
    const onStart = () => setState(State.running)
    const onPause = () => setState(State.paused)
    const onStop = () => setState(State.stopped)
    const watchTime = () => {
        const timeoutId = setTimeout(() => {
            setTimePassed((timePassed) => timePassed + 1)
            watchTime()
        }, 1000)

        setTickId(timeoutId)
    }

    useEffect(() => {
        if (timePassed === 0 || !timer) return

        if (timePassed === timer.duration) {
            if (repeat === timer.repeat) {
                const timerIndex = timers.findIndex((t) => t === timer)

                if (timerIndex === -1) {
                    setState(State.stopped)
                    return
                }

                const nextTimer = timers[timerIndex + 1]

                if (!nextTimer) {
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

                if (!timer) {
                    setTimer(timers[0])
                }

                watchTime()

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
                <button onClick={onStart}>Start</button>
                <button onClick={onPause}>Pause</button>
                <button onClick={onStop}>Stop</button>
            </div>
        </>
    )
}
