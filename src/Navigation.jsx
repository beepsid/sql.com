import './Navigation.css'

export function Navigation({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => onNavigate('home')}>
          <span className="brand-logo">∑</span>
          <span className="brand-text">Advanced SQL</span>
        </div>

        <div className="navbar-links">
          <button
            className={`nav-link ${currentPage === 'learn' ? 'active' : ''}`}
            onClick={() => onNavigate('learn')}
          >
            Learn SQL
          </button>
          <button
            className={`nav-link ${currentPage === 'practice' ? 'active' : ''}`}
            onClick={() => onNavigate('practice')}
          >
            Practice
          </button>
        </div>
      </div>
    </nav>
  )
}
