import { useState } from 'react';

const CostPredictor = () => {
    const [kms, setKms] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const handlePrediction = async (e) => {
        e.preventDefault();
        if (!kms || parseFloat(kms) <= 0) {
            setResult({ error: "Please enter a valid distance." });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch(`${API_URL}/predict-cost?kms=${kms}`);
            const data = await response.json();

            if (response.ok) {
                setResult(data);
            } else {
                setResult({ error: data.error || "An error occurred." });
            }
        } catch (err) {
            setResult({ error: "Failed to connect to the server." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <h2>🔮 Cost Predictor</h2>
            <form onSubmit={handlePrediction} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="number"
                    value={kms}
                    onChange={(e) => setKms(e.target.value)}
                    placeholder="Enter trip distance (km)"
                    required
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-secondary" disabled={isLoading}>
                    {isLoading ? "..." : "Predict"}
                </button>
            </form>
            {result && (
                <div style={{ textAlign: 'center', padding: '10px', borderRadius: '8px', background: 'var(--background-dark)' }}>
                    {result.error ? (
                        <p style={{ color: 'var(--danger-red)' }}>{result.error}</p>
                    ) : result.prediction !== null ? (
                        <p>Estimated Cost: <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            ₹{result.prediction.toFixed(2)}
                        </span></p>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>{result.message}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CostPredictor;