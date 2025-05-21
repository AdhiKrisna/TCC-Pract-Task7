import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const navigate = useNavigate();

    // Helper: Refresh token
    const refreshAccessToken = async () => {
        try {
            const response = await fetch(`${API_URL}/token`, {
                method: "GET",
                credentials: "include", // for refresh token cookie
            });

            if (!response.ok) throw new Error("Failed to refresh token");
            const data = await response.json();
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("user", JSON.stringify(data.user));
            return data.accessToken;
        } catch (error) {
            console.error("Error refreshing token", error);
            return null;
        }
    };

    const fetchWithRefresh = async (url, options = {}) => {
        let accessToken = localStorage.getItem("accessToken");

        // Tambah Authorization header
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        };

        let response = await fetch(url, options);

        // Kalau token expired
        if (response.status === 403) {
            const refreshRes = await fetch(`${API_URL}/token`, {
                method: "GET",
                credentials: "include", // Penting! Biar cookie refresh token ikut ke backend
            });

            if (!refreshRes.ok) throw new Error("Gagal refresh token");

            const data = await refreshRes.json();
            const newAccessToken = data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);

            // Retry request dengan token baru
            options.headers.Authorization = `Bearer ${newAccessToken}`;
            response = await fetch(url, options);
        }

        return response;
    };

    // Fetch notes using fetchWithRefresh
    const fetchNotes = async () => {
        try {
            const response = await fetchWithRefresh(`${API_URL}/notes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response && response.ok) {
                const data = await response.json();
                if (data.success) setNotes(data.notes);
            }
        } catch (error) {
            console.error("Error fetching notes data", error);
        }
    };

    // Add your updateNote and deleteNote methods here, using fetchWithRefresh

    const handleLogout = async () => {
        try {
            await fetch(`${API_URL}/logout`, {
                method: "DELETE",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            alert("Logout successful");
            navigate("/login");
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="w-100 mt-5 px-5 mb-3">
            <h1 className="text-center fw-bold">Aku Notes Triggered</h1>
            <p className="subHeader text-center">
                Directly Reach the Title and Content To Edit The Note Data
            </p>
            <button className="btn btn-danger mb-3 float-end" onClick={handleLogout}>
                Logout
            </button>
            <NoteForm
                fetchNotes={fetchNotes}
                fetchWithRefresh={fetchWithRefresh}
            />
            <hr />
            <NoteList
                notes={notes}
                fetchNotes={fetchNotes}
                fetchWithRefresh={fetchWithRefresh}
            />
        </div>
    );
};

export default Dashboard;
