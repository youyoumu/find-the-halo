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
  const [allowClick, setAllowClick] = useState(true)
  const modal = useRef(null)
  const [showModal, setShowModal] = useState(false)
  const [howLongToBeat, setHowLongToBeat] = useState(null)
  const nameInputRef = useRef(null)

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
      const request = await fetch('http://127.0.0.1:3000/')
      const response = await request.json()
      console.log(response)
      setImageId(response.image_id)
      setGameId(response.game_id)
    }
    getNewGame()
  }, [])

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
        style={{ left: `${markX}px`, top: `${markY}px` }}
      >
        <div className="w-1 h-1 bg-warning rounded-full"></div>
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
        if (response.total_hit_boxes === response.total_cleared) {
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
    fetch('http://127.0.0.1:3000/scores', {
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
    setShowModal(false)
    setAllowClick(false)
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

  if (imageId === null) {
    return <div>Loading</div>
  }

  return (
    <div>
      <div className="text-center text-3xl pt-4 mb-4">Find the Halo</div>
      <div className="flex">
        <div className="flex flex-col max-w-20 md:max-w-28 lg:max-w-36 p-3 gap-2">
          <Halos />
        </div>
        <div className="relative" ref={imageContainer} onClick={handleClick}>
          {HitMark}
          <Dropdown Mark={Mark} Options={Options} />
          <img src={images[imageId]} />
        </div>
      </div>
      <Modal />
    </div>
  )
}
