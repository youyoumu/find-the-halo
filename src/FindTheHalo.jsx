import image0 from './images/0.png'
import { useRef, useState, useEffect } from 'react'
import Dropdown from './components/Dropdown'
import wakamoHalo from './images/halo/Wakamo_Halo.png'
import nagisaHalo from './images/halo/Nagisa_Halo.png'
import aliceHalo from './images/halo/Alice_Halo.png'

const backEndUrl = import.meta.env.VITE_BACK_END_URL
console.log(backEndUrl)

export default function FindTheHalo() {
  const imageContainer = useRef(null)
  const [Mark, setMark] = useState(null)
  const [Options, setOptions] = useState(null)
  const [imageId, setImageId] = useState(null)
  const [gameId, setGameId] = useState(null)
  const images = [image0]
  const [HitMark, setHitMark] = useState([])
  const halos = [wakamoHalo, nagisaHalo, aliceHalo]
  const [allowClick, setAllowClick] = useState(true)
  const modal = useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [howLongToBeat, setHowLongToBeat] = useState(null)
  const nameInputRef = useRef(null)
  const [scores, setScores] = useState(null)
  const [allowMark, setAllowMark] = useState(true)
  const [time, setTime] = useState(0)
  const [timerIsRunning, setTimerIsRunning] = useState(true)
  const [error, setError] = useState(null)

  const Halos = () => {
    return halos.map((halo, i) => {
      return (
        <div key={i} className="shadow-sm p-2 rounded-md border-2">
          <div className="text-center mt-2 text-xs sm:text-sm md:text-md">{`Halo ${
            i + 1
          }`}</div>
          <img src={halo} alt="halo" />
        </div>
      )
    })
  }

  useEffect(() => {
    async function getNewGame() {
      try {
        const request = await fetch(`${backEndUrl}/`)
        const response = await request.json()
        console.log(response)
        setImageId(response.image_id)
        setGameId(response.game_id)
      } catch (err) {
        console.log(err)
        setError(err)
      }
    }
    async function getScores() {
      const request = await fetch(`${backEndUrl}/scores`)
      const response = await request.json()
      console.log(response)
      setScores(response)
    }
    getNewGame()
    getScores()
  }, [])

  useEffect(() => {
    if (!timerIsRunning) return
    const intervalId = setInterval(() => setTime(time + 1), 1000)

    return () => clearInterval(intervalId)
  }, [time, timerIsRunning])

  const handleClick = (e) => {
    if (!allowClick) return
    const bodyX = document.body.getBoundingClientRect().x
    const bodyY = document.body.getBoundingClientRect().y
    const containerX = imageContainer.current.getBoundingClientRect().x - bodyX
    const containerY = imageContainer.current.getBoundingClientRect().y - bodyY
    const containerWidth = imageContainer.current.getBoundingClientRect().width
    const containerHeight =
      imageContainer.current.getBoundingClientRect().height

    const x = ((e.pageX - containerX) / containerWidth) * 100
    const y = ((e.pageY - containerY) / containerHeight) * 100

    const markX = (x * containerWidth) / 100
    const markY = (y * containerHeight) / 100

    setMark(
      <div
        tabIndex={0}
        role="button"
        className={`absolute w-10 h-10`}
        style={{ left: `${markX - 8}px`, top: `${markY - 8}px` }}
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
          <a
            onClick={() => guessCoordinates(1)}
            onMouseEnter={() => setAllowClick(false)}
            onMouseLeave={() => setAllowClick(true)}
          >
            Halo 1
          </a>
        </li>
        <li>
          <a
            onClick={() => guessCoordinates(2)}
            onMouseEnter={() => setAllowClick(false)}
            onMouseLeave={() => setAllowClick(true)}
          >
            Halo 2
          </a>
        </li>
        <li>
          <a
            onClick={() => guessCoordinates(3)}
            onMouseEnter={() => setAllowClick(false)}
            onMouseLeave={() => setAllowClick(true)}
          >
            Halo 3
          </a>
        </li>
      </ul>
    )

    async function guessCoordinates(hitBoxId) {
      const request = await fetch(`${backEndUrl}/game`, {
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
        if (response.total_hit_boxes === response.total_cleared) {
          setTimerIsRunning(false)
          setShowModal(true)
          setHowLongToBeat(response.how_long_to_beat)
        }
      }
    }

    console.log(x, y)
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    const name = nameInputRef.current.value
    fetch(`${backEndUrl}/scores`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        player_name: name,
        game_id: gameId
      })
    })
    nameInputRef.current.value = ''

    async function getScores() {
      const request = await fetch(`${backEndUrl}/scores`)
      const response = await request.json()
      console.log(response)
      setScores(response)
    }
    getScores()

    setShowModal(false)
    setAllowClick(false)
    setAllowMark(false)
  }

  const Modal = () => {
    if (!showModal) return null

    return (
      <dialog ref={modal} id="my_modal_1" className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{`You cleared the game in ${howLongToBeat} seconds`}</h3>
          <p>Enter your name to submit your score</p>
          <div className="join">
            <input
              ref={nameInputRef}
              type="text"
              placeholder="Your name"
              className="input input-bordered w-full max-w-xs join-item"
              name="player_name"
            />
            <input type="hidden" name="game_id" value={gameId} />
            <button
              className="btn join-item btn-primary"
              type="submit"
              onClick={handleNameSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </dialog>
    )
  }

  function Scores() {
    return scores.map((score, i) => {
      return (
        <div key={score.id}>
          {`${i + 1}. ${score.player_name} - ${score.how_long_to_beat} seconds`}
        </div>
      )
    })
  }

  if (imageId === null) {
    return (
      <div className="text-3xl flex justify-center items-center h-screen">
        <div>
          {error ? <div>Server is offline</div> : <div>Loading...</div>}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between px-8">
        <div className="text-center text-3xl pt-4 mb-4 flex-1">
          Find the Halo
        </div>
        <div className="text-xl">{time}</div>
      </div>
      <div className="flex">
        <div className="flex flex-col max-w-20 md:max-w-28 lg:max-w-36 p-3 gap-2">
          <Halos />
        </div>
        <div className="relative" ref={imageContainer} onClick={handleClick}>
          {HitMark}
          {allowMark ? <Dropdown Mark={Mark} Options={Options} /> : null}
          <img src={images[imageId]} />
        </div>
      </div>
      <div className="flex flex-col items-center border-2 max-w-sm mx-auto mt-8 mb-4 rounded-md p-4">
        <h3 className="text-2xl font-bold mb-2">Scores</h3>
        <Scores />
      </div>
      <Modal />
    </div>
  )
}
