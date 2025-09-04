import { useState, useEffect } from 'react';

const TripBreakdown = ({ onDataChanged, trips }) => {
    const [breakdown, setBreakdown] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    useEffect(() => {
        const fetchBreakdown = async () => {
            // No need to fetch if there are no trips
            if (trips.length === 0) {
                setBreakdown(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/latest-trip-breakdown`);
                if (response.ok) {
                    const data = await response.json();
                    setBreakdown(data);
                } else {
                    setBreakdown(null); // Clear data on error
                }
            } catch (err) {
                console.error("Error fetching trip breakdown:", err);
                setBreakdown(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBreakdown();
        // This effect will re-run whenever the list of trips changes.
    }, [trips, API_URL]);

    return (
        <div className="card"> {/* Changed className */}
            <h2>📊 Last Trip Breakdown</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : !breakdown || !breakdown.trip ? (
                <p>Add a trip to see the breakdown.</p>
            ) : (
                <div>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        <strong>Date:</strong> {breakdown.trip.date} | <strong>Driver:</strong> {breakdown.trip.driver.name}
                        <br />
                        <strong>Total Cost:</strong> <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>₹{breakdown.trip.total_cost.toFixed(2)}</span>
                    </p>
                    <strong>Cost per person:</strong>
                    <ul className="item-list" style={{ marginTop: '10px' }}> {/* Changed className */}
                        {breakdown.breakdown.map((item, index) => (
                            <li key={index}>
                                {item.name}
                                <span style={{ color: 'var(--primary-green)', fontWeight: '600' }}>₹{item.share.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
export default TripBreakdown;