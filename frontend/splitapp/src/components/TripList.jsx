const TripList = ({ trips }) => {
    return (
        <div className="card"> {/* Changed className */}
            <h2>Recent Trips</h2>
            {trips.length === 0 ? (<p>No trips logged yet.</p>) : (
                <ul className="item-list"> {/* Changed className */}
                    {trips.map((trip) => (
                        // We'll use a fragment instead of li for more complex content
                        <div key={trip.id} style={{ padding: '12px', backgroundColor: 'var(--background-dark)', borderRadius: '8px' }}>
                            <strong>Date: {trip.date}</strong> | Driver: {trip.driver?.name}
                            <br />
                            <small style={{ color: 'var(--text-secondary)' }}>
                                {trip.total_kms} km via {trip.car?.name} | Total Cost: ₹{trip.total_cost?.toFixed(2)}
                            </small>
                            <ul style={{ paddingLeft: '20px', fontSize: '0.9em', marginTop: '5px', listStyleType: 'circle' }}>
                                {trip.participants.map((p) => (
                                    <li key={p.id} style={{ padding: '2px 0', background: 'none' }}>
                                        {p.friend?.name} ({p.direction})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default TripList;