import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const fetchNotes = async () => {
        try {
            let accessToken = localStorage.getItem("accessToken");

            let response = await fetch(`${API_URL}/notes`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Kalau token expired
            if (response.status === 403) {
                const refreshRes = await fetch(`${API_URL}/token`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!refreshRes.ok) throw new Error("Gagal refresh token");

                const dataRefresh = await refreshRes.json();
                const newAccessToken = dataRefresh.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                // Coba ulang request dengan token baru
                response = await fetch(`${API_URL}/notes`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${newAccessToken}`,
                    },
                });
            }

            if (!response.ok) throw new Error("Request gagal");

            const data = await response.json();
            if (data.success) {
                setNotes(data.notes);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };


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
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
        fetchNotes();
    }, []);

    const handleAddNote = (newNote) => {
        setNotes((prevNotes) => [...prevNotes, newNote]);
        };

    return (
        <div className="w-100 mt-5 px-5 mb-3">

            <h1 className="text-center fw-bold">Aku Notes</h1>
            <p className="subHeader text-center">
                Directly Reach the Title and Content To Edit The Note Data
            </p>
            {user && (
                <div className="text-start mb-2 fw-bold username">
                    <strong>Welcome, {user.username}!</strong>
                </div>
            )}
            <button className="btn btn-danger w-100 mb-3" onClick={handleLogout}>
                Logout
            </button>
            <NoteForm
                onAddNote={handleAddNote}
            />
            <hr />
            <NoteList
                notes={notes}
            />
        </div>

    );

};

export default Dashboard;
