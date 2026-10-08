export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="brand brand--footer">
          <img className="brand__logo" src={`${import.meta.env.BASE_URL}logo.png`} alt="" width="40" height="40" />
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
