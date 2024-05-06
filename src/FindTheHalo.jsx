import image0 from './images/0.png'
import { useRef, useState, useEffect } from 'react'
import Dropdown from './components/Dropdown'
import wakamoHalo from './images/halo/Wakamo_Halo.png'
import nagisaHalo from './images/halo/Nagisa_Halo.png'
import aliceHalo from './images/halo/Alice_Halo.png'

export default function FindTheHalo() {
  const imageContainer = useRef(null)
  const [Mark, setMark] = useState(null)
  const [Options, setOptions] = useState(null)
  const [imageId, setImageId] = useState(null)
  const [gameId, setGameId] = useState(null)
  const images = [image0]
  const [HitMark, setHitMark] = useState([])
  const halos = [wakamoHalo, nagisaHalo, aliceHalo]

  const Halos = () => {
    return halos.map((halo, i) => {
      return <img key={i} className="w-10 h-10" src={halo} alt="halo" />
    })
  }

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
    const bodyX = document.body.getBoundingClientRect().x
    const bodyY = document.body.getBoundingClientRect().y
    const containerX = imageContainer.current.getBoundingClientRect().x - bodyX
    const containerY = imageContainer.current.getBoundingClientRect().y - bodyY
    const containerWidth = imageContainer.current.getBoundingClientRect().width
    const containerHeight =
      imageContainer.current.getBoundingClientRect().height

    const x = ((e.pageX - containerX) / containerWidth) * 100
    const y = ((e.pageY - containerY) / containerHeight) * 100

    const markX = (x * containerWidth) / 100 - 8
    const markY = (y * containerHeight) / 100 - 8

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
          <a onClick={() => guessCoordinates(1)}>Halo 1</a>
        </li>
        <li>
          <a onClick={() => guessCoordinates(2)}>Halo 2</a>
        </li>
      </ul>
    )

    async function guessCoordinates(hitBoxId) {
      const request = await fetch('http://127.0.0.1:3000/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          x,
          y,
          game_id: gameId,
          image_id: imageId,
          hit_box_id: hitBoxId
        })
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
        const left = (response.coordinates.x_start * containerWidth) / 100
        const top = (response.coordinates.y_start * containerHeight) / 100
        const hitMark = (
          <div
            className="absolute border-2 border-warning"
            style={{
              width,
              height,
              left,
              top
            }}
            key={hitBoxId}
          ></div>
        )
        setHitMark((HitMark) => [...HitMark, hitMark])
      }
    }

    console.log(x, y)
  }

  if (imageId === null) {
    return <div>Loading</div>
  }

  return (
    <div>
      <div>
        <Halos />
      </div>
      <div className="relative" ref={imageContainer} onClick={handleClick}>
        {HitMark}
        <Dropdown Mark={Mark} Options={Options} />
        <img src={images[imageId]} />
      </div>
    </div>
  )
}
