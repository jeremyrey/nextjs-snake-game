import { useEffect, useState } from 'react';
import Food from '../components/Food';
import Snake from '../components/Snake';
import useInterval from '../hooks/useInterval';
import InfoScore from './InfoScore';

const getRandomCoords = () => {
  let min = 1
  let max = 90
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2
  return [x, y]
}

export default function Game() {
    const [speed, setSpeed] = useState<number>(200)
    const [food, setFood] = useState<number[]>(getRandomCoords())
    const [play, setPlay] = useState(false)
    const [pause, setPause] = useState(false)
    const [gameOver, setGameOver] = useState('')
    const [direction, setDirection] = useState("RIGHT")
    const [snake, setSnake] = useState<[number[], number[]]>([[0, 0],[2, 0]])
    
  // EQ ComponentDidMount
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
        case 'ArrowRight':
            setDirection('RIGHT')
          break
        case "ArrowUp":
            setDirection("UP")
          break
        case 'ArrowDown':
            setDirection('DOWN')
          break
        case 'ArrowLeft':
            setDirection('LEFT')
          break
        default:
            console.error('Error with handleKeyDown')
      }
}

  const resetStates = () => {
    setSpeed(200)
    setFood(getRandomCoords())
    setPlay(false)
    setPause(false)
    setGameOver('')
    setDirection('RIGHT')
    setSnake([[0, 0],[2, 0]])
  }

  useInterval(() => {
    // Your custom logic here
    moveSnake();
  }, speed);

  useEffect(() => {
    checkIfOutOfBorders()
    checkIfCollapsed()
    checkIfEat()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snake])

  const moveSnake = () => {
    let _snake : [number[], number[]] = [...snake]
    let head = _snake[_snake.length - 1]
    switch (direction) {
      case 'RIGHT':
        head = [head[0] + 2, head[1]]
        break
      case 'LEFT':
        head = [head[0] - 2, head[1]]
        break
      case 'DOWN':
        head = [head[0], head[1] + 2]
        break
      case 'UP':
        head = [head[0], head[1] - 2]
        break
    }
    if (!pause && play) {
        _snake.push(head)
        _snake.shift()
      setSnake(_snake)
    }
  }

  const checkIfOutOfBorders = () => {
    let _snake : [number[], number[]] = [...snake]
    let head = _snake[_snake.length - 1]
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      onGameOver()
    }
  }

  const checkIfCollapsed = () => {
    let _snake : [number[], number[]] = [...snake]
    let head = _snake[_snake.length - 1]
    _snake.pop()
    _snake.forEach((dot) => {
      if (head[0] == dot[0] && head[1] == dot[1]) {
        onGameOver()
      }
    })
  }

  const checkIfEat = () => {
    let _snake : [number[], number[]] = [...snake]
    let head = _snake[_snake.length - 1]
    if (head[0] == food[0] && head[1] == food[1]) {
      setFood(getRandomCoords())
      enlargeSnake()
      increaseSpeed()
    }
  }

  const enlargeSnake = () => {
    let _snake : [number[], number[]] = [...snake]
    _snake.unshift([])
    setSnake(_snake)
  }

  const increaseSpeed = () => {
    if (speed > 10) {
        setSpeed(speed - 10)
    }
  }

  const onGameOver = () => {
    resetStates()
    setGameOver(`Game Over! Your Score was ${snake.length} Try Again`)
  }

    return (
      <div>
        <div className="flex my-2 justify-center">
          <button
            className="rounded-md w-32 px-2 py-1 bg-slate-700 text-white"
            onClick={() => {
              if (play) {
                resetStates()
              } else setPlay(true)
            }}
          >
            {play ? 'End Game' : 'Play Game'}
          </button>
          {play ? (
            <button
              className="ml-2 rounded-md w-32 px-2 py-1 bg-slate-700 text-white"
              onClick={() => {
                setPause(!pause)
              }}
            >
              {pause ? 'Return Game' : 'Pause Game'}
            </button>
          ) : (
            <></>
          )}
        </div>
        {play ? (
          <div
            className={`game-area ${
              pause ? 'bg-gray-500' : 'bg-gray-200'
            } rounded-lg`}
          >
            <Snake snakeDots={snake} />
            <Food dot={food} />
            <InfoScore score={snake.length} />
          </div>
        ) : (
          <div className="text-white font-bold flex items-center">
            {gameOver}
          </div>
        )}
      </div>
    )
  
}