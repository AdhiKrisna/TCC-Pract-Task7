import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";


const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL", API_URL); // Harus muncul: http://localhost:5000
const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !username) {
      alert("Email, Username, and Password cannot be empty");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      alert("Registration error occurred");
    }
  };

  return (
    <div className="auth-form-container">
      <h1 className="form-title">Register</h1>

      <label className="form-label" htmlFor="emailRegisterInput">Email</label>
      <input
        type="email"
        className="form-control"
        id="emailRegisterInput"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="form-label mt-3" htmlFor="usernameRegisterInput">Username</label>
      <input
        type="text"
        className="form-control"
        id="usernameRegisterInput"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <label className="form-label mt-3" htmlFor="passwordRegisterInput">Password</label>
      <input
        type="password"
        className="form-control"
        id="passwordRegisterInput"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <p className="form-text mt-2">Already have an account? <a href="/login" className="text-decoration-none">Login</a></p>
      <button className="btn authButton mt-4" onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
