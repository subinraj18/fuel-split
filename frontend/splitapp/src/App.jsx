import { useEffect, useState } from "react";
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
  // State for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State for application data
  const [trips, setTrips] = useState([]);
  const [friends, setFriends] = useState([]);
  const [cars, setCars] = useState([]);
  const [petrolPrice, setPetrolPrice] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  // This useEffect will now only run AFTER authentication is successful
  useEffect(() => {
    // Don't fetch data if the user is not logged in
    if (!isAuthenticated) {
      return;
    }

    const fetchData = async () => {
      try {
        const [tripsRes, friendsRes, carsRes, priceRes] = await Promise.all([
          fetch(`${API_URL}/trips`),
          fetch(`${API_URL}/friends`),
          fetch(`${API_URL}/cars`),
          fetch(`${API_URL}/settings/petrol_price`),
        ]);

        const tripsData = await tripsRes.json();
        const friendsData = await friendsRes.json();
        const carsData = await carsRes.json();
        const priceData = await priceRes.json();

        setTrips(tripsData || []);
        setFriends(friendsData || []);
        setCars(carsData || []);
        setPetrolPrice(priceData.price || 0);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
    // It now depends on isAuthenticated and refreshKey
  }, [isAuthenticated, API_URL, refreshKey]);

  const handleDataChanged = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  const handleLogin = (password) => {
    if (password === "fuel") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  // If not authenticated, render the Login screen
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Once authenticated, render the main application
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