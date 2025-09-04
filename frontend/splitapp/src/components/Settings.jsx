import { useState, useEffect } from 'react';

const Settings = ({ petrolPrice, onPriceChanged }) => {
    const [price, setPrice] = useState(petrolPrice);
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    useEffect(() => {
        setPrice(petrolPrice);
    }, [petrolPrice]);

    const handleUpdatePrice = async () => {
        try {
            const response = await fetch(`${API_URL}/settings/petrol_price`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: parseFloat(price) }),
            });
            if (response.ok) {
                onPriceChanged();
                alert('Petrol price updated!');
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
            <h2>⛽ Petrol Price</h2>
            <div className="price-control" style={{ display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem', alignSelf: 'center' }}>₹</span>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" style={{ flex: 1 }} />
                {/* --- Styled Button --- */}
                <button onClick={handleUpdatePrice} className="btn btn-primary">
                    Update
                </button>
            </div>
        </div>
    );
};
export default Settings;