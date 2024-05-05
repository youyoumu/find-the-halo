import image0 from './images/0.png'
import { useRef, useState, useEffect } from 'react'
import Dropdown from './components/Dropdown'
import { FetchRequest } from '@rails/request.js'

export default function FindTheHalo() {
  const imageContainer = useRef(null)
  const [Mark, setMark] = useState(null)
  const [Options, setOptions] = useState(null)
  const [imageId, setImageId] = useState(null)
  const images = [image0]

  useEffect(() => {
    async function getNewGame() {
      const request = await fetch('http://127.0.0.1:3000/')
      const response = await request.json()
      console.log(response)
      setImageId(response)
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
      const request = new FetchRequest('post', 'http://127.0.0.1:3000/game', {
        body: JSON.stringify({ x, y })
      })
      const response = await request.perform()
      if (response.ok) {
        const body = await response.text
        console.log(body)
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
        <Dropdown Mark={Mark} Options={Options} />
        <img src={images[imageId]} />
      </div>
    </div>
  )
}
