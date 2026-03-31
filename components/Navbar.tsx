export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          Smart Baby System
        </a>

        <nav className="navbar__links">
          <a href="#how-it-works">How it works</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
        </nav>

        <div className="navbar__actions">
          <a href="#" className="navbar__login">
            Log in
          </a>
          <a href="#pricing" className="btn btn--primary">
            Start free
          </a>
        </div>
      </div>
    </header>
  );
}