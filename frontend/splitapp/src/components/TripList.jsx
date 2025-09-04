const TripList = ({ trips }) => {
    return (
        <div className="trip-list">
            <h2>Recent Trips</h2>
            {trips.length === 0 ? (<p>No trips logged yet.</p>) : (
                <ul>
                    {trips.map((trip) => (
                        <li key={trip.id} style={{ display: 'block', background: 'none', padding: '10px 0' }}>
                            <strong>Date: {trip.date}</strong> | Driver: {trip.driver?.name}
                            <br />
                            <small>
                                {trip.total_kms} km via {trip.car?.name} | Total Cost: ₹{trip.total_cost?.toFixed(2)}
                            </small>
                            <ul style={{ paddingLeft: '20px', fontSize: '0.9em', marginTop: '5px' }}>
                                {trip.participants.map((p) => (
                                    <li key={p.id} style={{ padding: '2px 0', background: 'none' }}>
                                        {p.friend?.name} ({p.direction})
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
export default TripList;