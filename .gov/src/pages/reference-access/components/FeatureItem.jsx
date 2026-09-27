export default function FeatureItem({ icon: Icon, title, children }) {
  return (
    <div className="feature">
      <div className="feature__ring">
        <Icon size={21} strokeWidth={1.6} />
      </div>
      <div>
        <div className="feature__title">{title}</div>
        <p className="feature__text">{children}</p>
      </div>
    </div>
  )
}
