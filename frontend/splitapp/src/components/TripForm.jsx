import { useState } from "react";

const TripForm = ({ friends, cars, onTripAdded }) => {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [totalKms, setTotalKms] = useState("");
    const [driverId, setDriverId] = useState("");
    const [carId, setCarId] = useState("");
    const [currentParticipants, setCurrentParticipants] = useState([]);
    const [selectedFriendId, setSelectedFriendId] = useState("");
    const [selectedDirection, setSelectedDirection] = useState("round");
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const handleAddParticipant = () => {
        if (!selectedFriendId) return alert("Please select a friend to add.");
        const friendToAdd = friends.find(f => f.id === parseInt(selectedFriendId));
        setCurrentParticipants([...currentParticipants, {
            friendId: friendToAdd.id,
            name: friendToAdd.name,
            direction: selectedDirection,
        }]);
        setSelectedFriendId("");
        setSelectedDirection("round");
    };

    const handleRemoveParticipant = (friendIdToRemove) => {
        setCurrentParticipants(currentParticipants.filter(p => p.friendId !== friendIdToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!driverId || !carId) return alert("Please select a driver and a car.");
        const payload = {
            date, total_kms: parseFloat(totalKms), driver_id: parseInt(driverId), car_id: parseInt(carId),
            participants: currentParticipants.map(p => ({ friend_id: p.friendId, direction: p.direction })),
        };
        try {
            const response = await fetch(`${API_URL}/trips`, {
                method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
            });
            if (response.ok) {
                setTotalKms(""); setDriverId(""); setCarId(""); setCurrentParticipants([]); onTripAdded();
            } else {
                const errorData = await response.json();
                alert("Error: " + errorData.message);
            }
        } catch (err) {
            alert("Something went wrong: Failed to fetch");
        }
    };

    const availableFriends = friends.filter(f => !currentParticipants.some(p => p.friendId === f.id));

    return (
        <form className="trip-form" onSubmit={handleSubmit}>
            <h2>Add New Trip</h2>
            <div className="form-group">
                <label>Total Kilometers</label>
                <input type="number" placeholder="e.g., 50" value={totalKms} onChange={(e) => setTotalKms(e.target.value)} min="0" step="0.1" required />
            </div>
            <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Car Used</label>
                    <select value={carId} onChange={e => setCarId(e.target.value)} required>
                        <option value="">-- Select a car --</option>
                        {cars.map(car => (<option key={car.id} value={car.id}>{car.name}</option>))}
                    </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                    <label>Driver (Who Paid?)</label>
                    <select value={driverId} onChange={e => setDriverId(e.target.value)} required>
                        <option value="">-- Select a driver --</option>
                        {friends.map(friend => (<option key={friend.id} value={friend.id}>{friend.name}</option>))}
                    </select>
                </div>
            </div>
            <div className="participants-section">
                <h3>Participants</h3>
                <div className="add-participant-controls">
                    <select value={selectedFriendId} onChange={(e) => setSelectedFriendId(e.target.value)}>
                        <option value="">-- Select a friend --</option>
                        {availableFriends.map(friend => (<option key={friend.id} value={friend.id}>{friend.name}</option>))}
                    </select>
                    <select value={selectedDirection} onChange={(e) => setSelectedDirection(e.target.value)}>
                        <option value="round">Two Way</option>
                        <option value="morning">One Way (Morning)</option>
                        <option value="evening">One Way (Evening)</option>
                    </select>
                    <button type="button" onClick={handleAddParticipant}>Add</button>
                </div>
                <ul className="participant-preview-list">
                    {currentParticipants.map(p => (
                        <li key={p.friendId}>
                            <span>{p.name} ({p.direction === 'round' ? 'Two Way' : 'One Way'})</span>
                            <button type="button" onClick={() => handleRemoveParticipant(p.friendId)} className="remove-btn">&times;</button>
                        </li>
                    ))}
                </ul>
            </div>
            <button type="submit" className="save-trip-btn">Save Trip</button>
        </form>
    );
};
export default TripForm;