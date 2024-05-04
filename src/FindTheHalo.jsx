import image0 from './images/0.png'
import { useRef } from 'react'

export default function FindTheHalo() {
  const imageContainer = useRef(null)
  const handleClick = (e) => {
    const containerX = imageContainer.current.getBoundingClientRect().x
    const containerY = imageContainer.current.getBoundingClientRect().y
    const containerWidth = imageContainer.current.getBoundingClientRect().width
    const containerHeight =
      imageContainer.current.getBoundingClientRect().height

    const x = ((e.pageX - containerX) / containerWidth) * 100
    const y = ((e.pageY - containerY) / containerHeight) * 100

    console.log(x, y)
  }

  return (
    <div>
      <div className="mt-8" ref={imageContainer} onClick={handleClick}>
        <img src={image0} />
      </div>
    </div>
  )
}
