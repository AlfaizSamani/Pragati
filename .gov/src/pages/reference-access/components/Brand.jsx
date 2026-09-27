import emblem from '../../../assets/ashoka-emblem.svg'

export default function Brand() {
  return (
    <>
      <div className="brand">
        <img className="brand__emblem" src={emblem} alt="Government of India emblem" />
        <div className="brand__name">PRAGATI</div>
      </div>
      <div className="hdr__rule" style={{ margin: '0 12px' }} />
      <div className="brand__sub">National Infrastructure Intelligence</div>
    </>
  )
}
