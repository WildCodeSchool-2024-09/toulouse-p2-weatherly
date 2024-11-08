import "./App.css";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="FiveDays">5jours</Link>
        <Link to="Favorites">Favoris</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
