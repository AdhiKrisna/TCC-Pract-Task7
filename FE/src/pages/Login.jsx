
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) navigate("/");
  }, []);

  const handleLogin = async () => {
    console.log("Login button clicked");
    console.log("API URL:", API_URL);
    if (!username || !password) {
      alert("Username and Password cannot be empty");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
         localStorage.setItem("user", JSON.stringify(data.data)); // optional
        alert("Login successful");
        navigate("/");
      } 
      
      else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Login error occurred");
    }
  };

  return (
    <div className="auth-form-container">
      <h1 className="form-title">Login</h1>
      <label className="form-label" htmlFor="usernameInput">username</label>
      <input type="username" className="form-control" id="usernameInput" value={username} onChange={(e) => setUsername(e.target.value)} />

      <label className="form-label mt-3" htmlFor="passwordInput">Password</label>
      <input type="password" className="form-control" id="passwordInput" value={password} onChange={(e) => setPassword(e.target.value)} />
      <p className="form-text mt-2">Don't have an account? <a href="/register" className="text-decoration-none ">Register</a></p>
      <button className="btn authButton mt-4" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;