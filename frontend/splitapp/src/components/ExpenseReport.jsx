import { useState, useEffect } from 'react';

const ExpenseReport = () => {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Current year
    const API_URL = "http://127.0.0.1:5000";

    const fetchExpenses = async () => {
        if (!selectedYear || !selectedMonth) return;
        setIsLoading(true);
        try {
            // Pass year and month as query parameters in the URL
            const response = await fetch(`${API_URL}/expenses?year=${selectedYear}&month=${selectedMonth}`);
            const data = await response.json();
            setExpenses(data);
        } catch (err) {
            console.error("Error fetching expenses:", err);
            alert("Failed to fetch expenses.");
        } finally {
            setIsLoading(false);
        }
    };

    // An array of years for the dropdown
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
    // An array of months for the dropdown
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


    return (
        <div className="expense-report">
            <h2>📊 Monthly Expense Report</h2>
            <div className="report-controls">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {months.map(month => (
                        <option key={month} value={month}>{monthNames[month - 1]}</option>
                    ))}
                </select>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
                <button onClick={fetchExpenses} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Generate Report'}
                </button>
            </div>
            <div className="report-results">
                {expenses.length > 0 && (
                    <ul>
                        {expenses.map(exp => (
                            <li key={exp.name}>
                                <strong>{exp.name}</strong>
                                <span>₹{exp.amount.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ExpenseReport;