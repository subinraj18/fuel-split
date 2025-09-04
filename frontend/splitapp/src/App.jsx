// Corrected code for frontend/splitapp/src/App.jsx
import { useEffect, useState } from "react";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import FriendManager from "./components/FriendManager";
import CarManager from "./components/CarManager";
import Settings from "./components/Settings";
import BalanceDashboard from "./components/BalanceDashboard";
import ExpenseReport from "./components/ExpenseReport";
import TripBreakdown from "./components/TripBreakdown";
import "./App.css";

function App() {
  const [trips, setTrips] = useState([]);
  const [friends, setFriends] = useState([]);
  const [cars, setCars] = useState([]);
  const [petrolPrice, setPetrolPrice] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0); // Add a refresh key

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          tripsRes,
          friendsRes,
          carsRes,
          priceRes
        ] = await Promise.all([
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
  }, [API_URL, refreshKey]); // Refetch when refreshKey changes

  const handleDataChanged = () => {
    setRefreshKey(oldKey => oldKey + 1); // Trigger a refresh
  };


  return (
    <div className="app">
      <h1>🚗 FuelFlow</h1>
      <div className="main-content">
        <div className="left-panel">
          <TripForm friends={friends} cars={cars} onTripAdded={handleDataChanged} />
          <TripList trips={trips} />
        </div>
        <div className="right-panel">
          {/* 2. Replace BalanceDashboard with the new TripBreakdown component */}
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