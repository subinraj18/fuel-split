import { useState, useEffect } from 'react';

const BalanceDashboard = ({ trips, onDataChanged }) => {
    const [balances, setBalances] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    useEffect(() => {
        const fetchBalances = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/balances`);
                const data = await response.json();
                setBalances(data);
            } catch (err) {
                console.error("Error fetching balances:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBalances();
    }, [trips, API_URL]);

    const handleSettleUp = async (debt) => {
        if (!window.confirm(`Settle ${debt.from_name}'s debt to ${debt.to_name} of ₹${debt.amount}?`)) return;
        try {
            const response = await fetch(`${API_URL}/payments`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from_id: debt.from_id, to_id: debt.to_id, amount: debt.amount }),
            });
            if (response.ok) {
                if (onDataChanged) onDataChanged();
            } else {
                alert("Failed to record payment.");
            }
        } catch (err) {
            alert("Something went wrong: Failed to fetch");
        }
    };

    return (
        <div className="balance-dashboard">
            <h2>💸 Who Owes Who</h2>
            {isLoading ? (<p>Calculating...</p>) : balances.length === 0 ? (<p>Everyone is settled up!</p>) : (
                <ul>
                    {balances.map((debt, index) => (
                        <li key={index}>
                            <div>
                                <strong>{debt.from_name}</strong> owes <strong>{debt.to_name}</strong>
                                <span>₹{debt.amount}</span>
                            </div>
                            <button className="settle-btn" onClick={() => handleSettleUp(debt)}>Settle Up</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default BalanceDashboard;