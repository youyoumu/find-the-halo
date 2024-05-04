import image0 from './images/0.png'
import { useRef, useState } from 'react'

export default function FindTheHalo() {
  const imageContainer = useRef(null)
  const [mark, setMark] = useState(null)
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
        className={`absolute w-4 h-4 bg-warning rounded-full`}
        style={{ left: `${markX}px`, top: `${markY}px` }}
      ></div>
    )

    console.log(x, y)
  }

  return (
    <div>
      <div className="static" ref={imageContainer} onClick={handleClick}>
        <img src={image0} />
        {mark}
      </div>
    </div>
  )
}
