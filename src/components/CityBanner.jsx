import { KIND_LABELS, kindOf } from '../data'
import { useDate } from '../context/DateContext.jsx'
import { cityCredit, cityPhoto } from '../utils/links'

// Wide banner at the top of the venue section: landmark photo, blurb and venue counts.
export default function CityBanner() {
  const { cityInfo, cityVenues } = useDate()
  const photo = cityPhoto(cityInfo.id)
  const credit = cityCredit(cityInfo.id)

  const counts = cityVenues.reduce((acc, v) => {
    const k = kindOf(v)
    acc[k] = (acc[k] || 0) + 1
    return acc
  }, {})

  return (
    <div className="city-banner glass">
      {photo && <img key={cityInfo.id} className="city-banner__img" src={photo} alt={credit ? credit.landmark : cityInfo.name} />}
      <span className="city-banner__shade" aria-hidden="true" />
      <div className="city-banner__body">
        <p className="eyebrow">{cityInfo.group}</p>
        <h3 className="city-banner__name"><span aria-hidden="true">{cityInfo.emoji}</span> {cityInfo.name}</h3>
        <p className="city-banner__blurb">{cityInfo.blurb}</p>
        <ul className="city-banner__counts">
          <li><strong>{cityVenues.length}</strong> venues</li>
          {Object.keys(KIND_LABELS).filter((k) => counts[k]).map((k) => (
            <li key={k}><strong>{counts[k]}</strong> {KIND_LABELS[k].toLowerCase()}</li>
          ))}
        </ul>
      </div>
      {credit && (
        <p className="city-banner__credit">
          {credit.landmark} · photo by {credit.author} ·{' '}
          <a href={credit.source} target="_blank" rel="noopener noreferrer">{credit.license}</a>
        </p>
      )}
    </div>
  )
}
