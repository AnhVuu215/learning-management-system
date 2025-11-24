import Navbar from './Navbar.jsx';

const Layout = ({ children }) => (
  <div className="app-shell">
    <Navbar />
    <main className="container">{children}</main>
  </div>
);

export default Layout;

