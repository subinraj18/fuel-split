import { useEffect, useState } from "react";
// Import the new Login component
import Login from "./components/Login";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import FriendManager from "./components/FriendManager";
import CarManager from "./components/CarManager";
import Settings from "./components/Settings";
import TripBreakdown from "./components/TripBreakdown";
import ExpenseReport from "./components/ExpenseReport";
import "./App.css";

function App() {
  // 1. Add state to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [trips, setTrips] = useState([]);
  const [friends, setFriends] = useState([]);
  const [cars, setCars] = useState([]);
  const [petrolPrice, setPetrolPrice] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const fetchData = () => { /* ... (keep your existing fetchData logic) ... */ };
  const handleDataChanged = () => { /* ... (keep your existing handleDataChanged logic) ... */ };
  useEffect(() => { /* ... (keep your existing useEffect logic) ... */ }, []);

  // 2. Create a function to handle the login attempt
  const handleLogin = (password) => {
    if (password === "fuel") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  // 3. If not authenticated, show the Login component
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // 4. If authenticated, show the main application
  return (
    <div className="app">
      <h1>🚗 FuelFlow</h1>
      <div className="main-content">
        <div className="left-panel">
          <TripForm friends={friends} cars={cars} onTripAdded={handleDataChanged} />
          <TripList trips={trips} />
        </div>
        <div className="right-panel">
          <TripBreakdown trips={trips} onDataChanged={handleDataChanged} />
          <ExpenseReport />
          <Settings petrolPrice={petrolPrice} onPriceChanged={handleDataChanged} />
          <CarManager cars={cars} onCarsChanged={handleDataChanged} />
          <FriendManager friends={friends} onFriendsChanged={handleDataChanged} />
        </div>
      </div>
    </div>
  );
}

export default App;