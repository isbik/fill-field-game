import clsx from "clsx"
import { useCallback, useEffect, useMemo, useState } from "react"
import StartGame from "../hooks/components/StartGame/StartGame"

function generateField(n, m) {
  return Array.from({ length: n }).map(() => Array.from({ length: m }).map(() => ({})))
}

function random(min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min
}

const PLAYERS = {
  1: 'first',
  2: 'second',
  3: 'third',
  4: 'fourth'
}

export default function Home() {
  const [field, setNewField] = useState([])
  const [numbers, setNumbers] = useState([])
  const [selected, setSelected] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(1)
  const [players, setPlayers] = useState(2)
  const [isStarted, setIsStarted] = useState(false)

  const SIZE = useMemo(() => {
    return field.length
  }, [field])

  const countTotal = useMemo(() => {
    const result = {}

    field.forEach(row => {
      (row || []).forEach(cell => {
        const player = cell?.player
        if (player) {
          result[player] = result[player] ? result[player] + 1 : 1
        }
      })
    })
    return result
  }, [field])

  const locatedCells = useMemo(() => {
    return Object.values(countTotal).reduce((acc, v) => acc += v, 0)
  }, [countTotal])


  useEffect(() => {
    if (locatedCells === SIZE * SIZE) setIsStarted(false)
  }, [SIZE, locatedCells])


  const handleGenerate = useCallback(() => {
    const procent = locatedCells / (SIZE * SIZE) * 100
    let upLimit = 6

    if (procent > 95) {
      upLimit = 1
    }

    else if (procent > 90) {
      upLimit = 2
    }

    else if (procent > 80) {
      upLimit = 3
    }

    else if (procent > 70) {
      upLimit = 3
    }
    setNumbers([random(1, upLimit), random(1, upLimit)])
  }, [SIZE, locatedCells])

  const handleSelect = (n, m) => {
    setSelected([n, m])
  }

  const handleMove = () => {
    const [x, y] = selected
    const [start, end] = numbers

    const newField = [...field]

    for (let i = x; i < x + start; i++) {
      for (let j = y; j < y + end; j++) {
        newField[i][j].player = currentPlayer
      }
    }

    setNewField(newField)
    setCurrentPlayer((currentPlayer % players) + 1)
    setNumbers([])
    handleGenerate()
  }
  // function for check if player can insert own field
  const isAllowPut = useMemo(() => {
    const [x, y] = selected
    const [height, width] = numbers


    // check if not in the field
    if (((x + height) > SIZE) || ((y + width) > SIZE)) {
      return false
    }

    // check if overlapping other player

    for (let i = x; i < x + height; i++) {
      for (let j = y; j < y + width; j++) {
        if (field[i][j].player) return false
      }
    }


    // check if all areas if free
    for (let i = x; i < x + height; i++) {
      for (let j = y; j < y + width; j++) {

        if (j >= 0 && j <= SIZE - 1) {
          if (field[i][j - 1]?.player === currentPlayer) return true
          if (field[i][j + 1]?.player === currentPlayer) return true
        }

        if (i >= 0 && i <= SIZE - 1) {
          if (field[i - 1]?.[j]?.player === currentPlayer) return true
          if (field[i + 1]?.[j]?.player === currentPlayer) return true

        }

      }
    }
    return false;

  }, [selected, numbers, SIZE, field, currentPlayer])

  const isHighlight = (n, m) => {
    const [x, y] = selected
    const [start, end] = numbers

    for (let i = x; i < x + start; i++) {
      for (let j = y; j < y + end; j++) {
        if (n === i && m === j) return true
      }
    }

    return false
  }

  const handleStartGame = ({ size, players }) => {
    setNewField(generateField(size, size))
    handleGenerate()
    setNewField((prev) => {
      prev[0][0].player = 1
      prev[prev.length - 1][prev.length - 1].player = 2
      if (players === 4) {
        prev[0][prev.length - 1].player = 3
        prev[prev.length - 1][0].player = 4

      }
      return prev
    })
    setPlayers(players)
    setIsStarted(true)
  }

  if (!isStarted) {
    return <StartGame onStart={handleStartGame} />
  }

  return (
    <div className="game">
      <div className="info" style={{ display: 'flex', gap: 10 }}>
        <div className="scores">
          <p>Очки</p>
          <div className="count">
            {Array.from({ length: players }).map((_, index) =>
              <span
                style={{ marginRight: 10 }}
                key={index}
                className={clsx('player', {
                  [PLAYERS[currentPlayer]]: currentPlayer === index + 1
                },

                )}>

                P{index + 1}: {countTotal[index + 1] || 0}</span>
            )}
          </div>
        </div>

        <div className="roll-numbers">

          <span className="roll-number">
            {numbers[0]}
          </span>
          <span className="roll-number">
            {numbers[1]}
          </span>
          <span
            onClick={() => {
              setCurrentPlayer(currentPlayer % 4 + 1)
              handleGenerate()

            }}
            className="roll-number passing">
            Пропустить
          </span>
        </div>
      </div>
      <div
        onClick={() => isAllowPut && handleMove()}

        className="board">
        {field.map((row, rowIndex) =>
          <div className='row' key={rowIndex}>
            {(row || []).map((cell, cellIndex) => (
              <div
                onMouseMove={() => handleSelect(rowIndex, cellIndex)}
                className={
                  clsx('cell', PLAYERS[field[rowIndex][cellIndex]?.player],

                    {
                      'highlight': isHighlight(rowIndex, cellIndex),
                      'error': !isAllowPut,
                    })

                } key={cellIndex}></div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
