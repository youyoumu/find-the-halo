import image0 from './images/0.png'
import { useRef, useState, useEffect } from 'react'
import Dropdown from './components/Dropdown'

export default function FindTheHalo() {
  const imageContainer = useRef(null)
  const [Mark, setMark] = useState(null)
  const [Options, setOptions] = useState(null)
  const [imageId, setImageId] = useState(null)
  const [gameId, setGameId] = useState(null)
  const images = [image0]
  const [HitMark, setHitMark] = useState(null)

  useEffect(() => {
    async function getNewGame() {
      const request = await fetch('http://127.0.0.1:3000/')
      const response = await request.json()
      console.log(response)
      setImageId(response.image_id)
      setGameId(response.game_id)
    }
    getNewGame()
  }, [])

  const handleClick = (e) => {
    const containerX = imageContainer.current.getBoundingClientRect().x
    const containerY = imageContainer.current.getBoundingClientRect().y
    const containerWidth = imageContainer.current.getBoundingClientRect().width
    const containerHeight =
      imageContainer.current.getBoundingClientRect().height

    const x = ((e.pageX - containerX) / containerWidth) * 100
    const y = ((e.pageY - containerY) / containerHeight) * 100

    const markX = e.pageX - containerX - 8
    const markY = e.pageY - containerY - 8

    setMark(
      <div
        tabIndex={0}
        role="button"
        className={`absolute w-10 h-10`}
        style={{ left: `${markX}px`, top: `${markY}px` }}
      >
        <div className="w-4 h-4 bg-warning rounded-full"></div>
      </div>
    )

    setOptions(
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        style={{ left: `${markX}px`, top: `${markY + 24}px` }}
      >
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    )

    async function myMethod() {
      const request = await fetch('http://127.0.0.1:3000/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ x, y, game_id: gameId, image_id: imageId })
      })
      const response = await request.json()
      console.log(response)

      if (response.hit) {
        const width =
          ((response.coordinates.x_end - response.coordinates.x_start) *
            containerWidth) /
          100
        const height =
          ((response.coordinates.y_end - response.coordinates.y_start) *
            containerHeight) /
          100
        const hitMark = (
          <div
            className="absolute border-2 border-warning"
            style={{
              width,
              height,
              left: response.coordinates.x_start,
              top: response.coordinates.y_start
            }}
          ></div>
        )
        setHitMark(hitMark)
      }
    }

    myMethod()
    console.log(x, y)
  }

  if (imageId === null) {
    return <div>Loading</div>
  }

  return (
    <div>
      <div className="static" ref={imageContainer} onClick={handleClick}>
        {HitMark}
        <Dropdown Mark={Mark} Options={Options} />
        <img src={images[imageId]} />
      </div>
    </div>
  )
}
