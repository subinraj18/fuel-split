import { useState } from 'react';
import './Login.css'; // We will create this file next

const Login = ({ onLogin }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(password);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>⛽ FuelFlow</h1>
                <p>Enter password to continue</p>
                <form onSubmit={handleSubmit} className="login-form">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        autoFocus
                    />
                    <button type="submit">Enter</button>
                </form>
            </div>
        </div>
    );
};

export default Login;