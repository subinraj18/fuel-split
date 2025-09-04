import { useState } from 'react';

const FriendManager = ({ friends, onFriendsChanged }) => {
    const [name, setName] = useState('');
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            const response = await fetch(`${API_URL}/friends`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (response.ok) {
                setName('');
                onFriendsChanged();
            } else {
                const errorData = await response.json();
                alert('Error: ' + errorData.message);
            }
        } catch (err) {
            alert('Something went wrong: Failed to fetch');
        }
    };

    const handleDeleteFriend = async (friendId) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const response = await fetch(`${API_URL}/friends/${friendId}`, { method: 'DELETE' });
            if (response.ok) {
                onFriendsChanged();
            } else {
                alert('Failed to delete friend.');
            }
        } catch (err) {
            alert('Something went wrong: Failed to fetch');
        }
    };

    return (
        <div className="friend-manager">
            <h2>🧑‍🤝‍🧑 Manage Friends</h2>
            <form onSubmit={handleAddFriend} className="add-friend-form">
                <input type="text" placeholder="Enter friend's name" value={name} onChange={(e) => setName(e.target.value)} required />
                <button type="submit">Add Friend</button>
            </form>
            <ul className="friend-list">
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.name}
                        <button onClick={() => handleDeleteFriend(friend.id)} className="remove-btn">&times;</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default FriendManager;