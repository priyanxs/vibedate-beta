import Icon from './Icon.jsx'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="brand brand--footer">
          <span className="brand__mark"><Icon name="heart" size={16} strokeWidth={2.2} /></span>
          <span className="brand__name">VibeDate</span>
        </p>
        <p className="footer__note">
          Venue details, menus and prices are illustrative sample data — please confirm with the venue before you go.
          Be kind, be honest and respect boundaries. Plans are saved only on this device.
        </p>
      </div>
    </footer>
  )
}
