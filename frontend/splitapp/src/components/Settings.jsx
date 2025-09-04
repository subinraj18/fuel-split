import { useState, useEffect } from 'react';

const Settings = ({ petrolPrice, onPriceChanged }) => {
    const [price, setPrice] = useState(petrolPrice);
    const API_URL = "http://127.0.0.1:5000";

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
            alert('Something went wrong: ' + err.message);
        }
    };

    return (
        <div className="settings">
            <h2>⛽ Petrol Price</h2>
            <div className="price-control">
                <span>₹</span>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    step="0.01"
                />
                <button onClick={handleUpdatePrice}>Update</button>
            </div>
        </div>
    );
};

export default Settings;