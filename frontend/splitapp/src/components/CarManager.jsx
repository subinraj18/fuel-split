import { useState } from 'react';

const CarManager = ({ cars, onCarsChanged }) => {
    const [name, setName] = useState('');
    const [mileage, setMileage] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const handleAddCar = async (e) => {
        e.preventDefault();
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

    return (
        <div className="card"> {/* Changed className */}
            <h2>🚗 Manage Cars</h2>
            <form onSubmit={handleAddCar} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input type="text" placeholder="Car Name (e.g., My Bike)" value={name} onChange={(e) => setName(e.target.value)} required style={{ flex: 1 }} />
                <input type="number" placeholder="Mileage (km/l)" value={mileage} onChange={(e) => setMileage(e.target.value)} min="0" step="0.1" required style={{ flex: 1 }} />
                {/* --- Styled Button --- */}
                <button type="submit" className="btn btn-primary">
                    Add Car
                </button>
            </form>
            <ul className="item-list"> {/* Changed className */}
                {cars.map(car => (
                    <li key={car.id}>
                        {car.name} <span>({car.mileage} km/l)</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default CarManager;