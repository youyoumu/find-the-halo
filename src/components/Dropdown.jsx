export default function Dropdown({ Mark, Options }) {
  return (
    <div className="absolute dropdown dropdown-hover">
      {Mark}
      {Options}
    </div>
  )
}
