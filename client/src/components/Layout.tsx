import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>Spanish Learning App</h1>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/weekly-test" className={isActive('/weekly-test') ? 'active' : ''}>
              Weekly Test
            </Link>
          </li>
          <li>
            <Link to="/daily-word" className={isActive('/daily-word') ? 'active' : ''}>
              Daily Word
            </Link>
          </li>
          <li>
            <Link to="/lessons" className={isActive('/lessons') ? 'active' : ''}>
              Lessons
            </Link>
          </li>
          <li>
            <Link to="/stories" className={isActive('/stories') ? 'active' : ''}>
              Stories
            </Link>
          </li>
          <li>
            <Link to="/vocabulary" className={isActive('/vocabulary') ? 'active' : ''}>
              My Progress
            </Link>
          </li>
        </ul>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
