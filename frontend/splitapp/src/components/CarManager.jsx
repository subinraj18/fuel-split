import { useState } from 'react';

const CarManager = ({ cars, onCarsChanged }) => {
    const [name, setName] = useState('');
    const [mileage, setMileage] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const handleAddCar = async (e) => {
        e.preventDefault();
        // ... (this function remains the same)
        if (!name.trim() || !mileage.trim()) return;
        try {
            const response = await fetch(`${API_URL}/cars`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, mileage: parseFloat(mileage) }),
            });
            if (response.ok) {
                setName('');
                setMileage('');
                onCarsChanged();
            } else {
                const errorData = await response.json();
                alert('Error: ' + errorData.message);
            }
        } catch (err) {
            alert('Something went wrong: Failed to fetch');
        }
    };

    // --- NEW: Function to handle car deletion ---
    const handleDeleteCar = async (carId) => {
        // Confirm before deleting
        if (!window.confirm("Are you sure you want to delete this car?")) return;

        try {
            const response = await fetch(`${API_URL}/cars/${carId}`, { method: 'DELETE' });
            if (response.ok) {
                onCarsChanged(); // Refresh the list of cars
            } else {
                const errorData = await response.json();
                alert('Failed to delete car: ' + errorData.message);
            }
        } catch (err) {
            alert('Something went wrong: Failed to fetch');
        }
    };

    return (
        <div className="card">
            <h2>🚗 Manage Cars</h2>
            <form onSubmit={handleAddCar} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" placeholder="Car Name (e.g., My Bike)" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 1 }} />
                <input type="number" placeholder="Mileage (km/l)" value={mileage} onChange={(e) => setMileage(e.target.value)} min="0" step="0.1" required style={{ flex: 1 }} />
                <button type="submit" className="btn btn-primary">
                    Add Car
                </button>
            </form>
            <ul className="item-list">
                {cars.map(car => (
                    <li key={car.id}>
                        <div> {/* Wrap text in a div to align properly */}
                            {car.name} <span style={{ color: 'var(--text-secondary)' }}>({car.mileage} km/l)</span>
                        </div>
                        {/* --- NEW: Delete button --- */}
                        <button onClick={() => handleDeleteCar(car.id)} className="remove-btn">
                            &times;
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default CarManager;