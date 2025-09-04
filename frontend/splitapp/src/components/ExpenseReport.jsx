import { useState } from 'react';

const ExpenseReport = () => {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const fetchExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/expenses?year=${selectedYear}&month=${selectedMonth}`);
            const data = await response.json();
            setExpenses(data);
        } catch (err) {
            alert("Failed to fetch expenses.");
        } finally {
            setIsLoading(false);
        }
    };

    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="card"> {/* Changed className */}
            <h2>📊 Monthly Expense Report</h2>
            <div className="report-controls" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {monthNames.map((name, index) => (<option key={index} value={index + 1}>{name}</option>))}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {years.map(year => (<option key={year} value={year}>{year}</option>))}
                </select>
                {/* --- Styled Button --- */}
                <button onClick={fetchExpenses} disabled={isLoading} className="btn btn-primary">
                    {isLoading ? 'Loading...' : 'Generate'}
                </button>
            </div>
            <ul className="item-list"> {/* Changed className */}
                {expenses.map(exp => (
                    <li key={exp.name}>
                        <strong>{exp.name}</strong>
                        <span>₹{exp.amount.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default ExpenseReport;