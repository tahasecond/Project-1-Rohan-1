import React, { useState } from 'react';
import './styles.css';

const PasswordResetPopup = ({ isOpen, onClose, onSubmit }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (newPassword != confirmPassword) {
            alert("New password does not match!");
        }
        await onSubmit({ currentPassword, newPassword });
        
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    if (!isOpen) return null;

    return (
        <div className="password-reset-overlay">
            <div className="password-reset-popup">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">Reset Password</button>
                </form>
            </div>
        </div>
    );
};

export default PasswordResetPopup; 