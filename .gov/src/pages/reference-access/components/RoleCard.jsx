export default function RoleCard({ icon: Icon, title, description, selected, onSelect }) {
  return (
    <button
      type="button"
      className={'role' + (selected ? ' is-sel' : '')}
      onClick={onSelect}
      role="radio"
      aria-checked={selected}
    >
      <span className="role__radio" />
      <span className="role__icon"><Icon size={21} strokeWidth={1.7} /></span>
      <span className="role__title">{title}</span>
      <span className="role__text">{description}</span>
    </button>
  )
}
