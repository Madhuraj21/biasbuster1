import React, { useState } from 'react';
import './RegistrationPage.css';

function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = e => {
    e.preventDefault();
    // Placeholder: Add registration logic
    alert('Registration submitted!');
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">Register</h1>
      <form className="registration-form" onSubmit={handleRegister}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationPage;
