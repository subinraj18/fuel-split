import { useEffect, useState, useCallback } from "react";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import FriendManager from "./components/FriendManager";
import CarManager from "./components/CarManager";
import Settings from "./components/Settings";
import BalanceDashboard from "./components/BalanceDashboard";
import ExpenseReport from "./components/ExpenseReport";
import "./App.css";

function App() {
  const [trips, setTrips] = useState([]);
  const [friends, setFriends] = useState([]);
  const [cars, setCars] = useState([]);
  const [petrolPrice, setPetrolPrice] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  const fetchData = useCallback(async (endpoint, setter) => {
    try {
      const response = await fetch(`${API_URL}/${endpoint}`);
      const data = await response.json();

      if (endpoint === 'settings/petrol_price') {
        setter(data.price || 0);
      } else {
        setter(data || []);
      }
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
    }
  }, [API_URL]);

  const handleDataChanged = useCallback(() => {
    fetchData("trips", setTrips);
    fetchData("friends", setFriends);
    fetchData("cars", setCars);
    fetchData("settings/petrol_price", setPetrolPrice);
  }, [fetchData]);

  useEffect(() => {
    handleDataChanged();
  }, [handleDataChanged]);

  return (
    <div className="app">
      <h1>🚗 FuelFlow</h1>
      <div className="main-content">
        <div className="left-panel">
          <TripForm friends={friends} cars={cars} onTripAdded={handleDataChanged} />
          <TripList trips={trips} />
        </div>
        <div className="right-panel">
          <BalanceDashboard trips={trips} onDataChanged={handleDataChanged} />
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