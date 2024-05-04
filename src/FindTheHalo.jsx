import image0 from './images/0.png'
import { useRef, useState } from 'react'
import Dropdown from './components/Dropdown'

export default function FindTheHalo() {
  const imageContainer = useRef(null)
  const [Mark, setMark] = useState(null)
  const [Options, setOptions] = useState(null)

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
        style={{ left: `${markX}px`, top: `${markY + 36}px` }}
      >
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
      </ul>
    )

    console.log(x, y)
  }

  return (
    <div>
      <div className="static" ref={imageContainer} onClick={handleClick}>
        <Dropdown Mark={Mark} Options={Options} />
        <img src={image0} />
      </div>
    </div>
  )
}
