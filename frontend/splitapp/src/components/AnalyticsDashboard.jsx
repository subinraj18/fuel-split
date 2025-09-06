import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- Color palette for the charts ---
const chartColors = {
    primary: 'rgba(168, 244, 156, 1)',
    blue: '#63B3ED',
    orange: '#F6AD55',
    purple: '#B794F4',
    gray: '#A7A7A7',
    text: '#A7A7A7'
};

const AnalyticsDashboard = () => {
    const [expenseData, setExpenseData] = useState(null);
    const [carData, setCarData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // --- State for the filters is now back ---
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const fetchAnalytics = async () => {
        setIsLoading(true);
        try {
            const colorPalette = [chartColors.primary, chartColors.blue, chartColors.orange, chartColors.purple, chartColors.gray];

            // Fetch car usage (always all-time)
            const carRes = await fetch(`${API_URL}/analytics/car_usage`);
            const carJson = await carRes.json();
            setCarData({
                labels: carJson.labels,
                datasets: [{
                    label: 'Trips Taken',
                    data: carJson.data,
                    backgroundColor: colorPalette,
                    borderColor: 'var(--card-dark)',
                    borderWidth: 2,
                }],
            });

            // --- Fetch expense data for the SELECTED month and year ---
            const expenseRes = await fetch(`${API_URL}/analytics/expenses_by_friend?year=${selectedYear}&month=${selectedMonth}`);
            const expenseJson = await expenseRes.json();
            setExpenseData({
                labels: expenseJson.labels,
                datasets: [{
                    label: `Monthly Fuel Cost (₹)`,
                    data: expenseJson.data,
                    backgroundColor: colorPalette,
                    borderColor: colorPalette,
                    borderWidth: 1,
                }],
            });

        } catch (err) {
            console.error("Failed to fetch analytics:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when the component first loads
    useEffect(() => {
        fetchAnalytics();
    }, []); // This will run once when the component mounts

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const chartOptions = {
        plugins: {
            legend: { labels: { color: chartColors.text } }
        },
        scales: {
            y: { ticks: { color: chartColors.text }, grid: { color: 'rgba(167, 167, 167, 0.2)' } },
            x: { ticks: { color: chartColors.text }, grid: { color: 'rgba(167, 167, 167, 0.2)' } }
        }
    };

    return (
        <div className="card">
            <h2>📊 Analytics Dashboard</h2>

            {/* --- Filter controls are back --- */}
            <div style={{ marginBottom: '40px' }}>
                <h4>Expenses by Friend (Monthly)</h4>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                        {monthNames.map((name, index) => (<option key={index} value={index + 1}>{name}</option>))}
                    </select>
                    <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                        {years.map(year => (<option key={year} value={year}>{year}</option>))}
                    </select>
                    <button onClick={fetchAnalytics} disabled={isLoading} className="btn btn-primary">
                        {isLoading ? '...' : 'Generate'}
                    </button>
                </div>
                {expenseData ? <Bar data={expenseData} options={chartOptions} /> : <p>Loading chart...</p>}
            </div>

            <div>
                <h4>Car Usage (All Time)</h4>
                {carData ? <div style={{ maxWidth: '250px', margin: '0 auto' }}><Doughnut data={carData} /></div> : <p>Loading chart...</p>}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;