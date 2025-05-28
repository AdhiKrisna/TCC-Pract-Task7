import { useState, useEffect, useRef } from "react";
const API_URL = import.meta.env.VITE_API_URL;

import "../styles/NoteList.css";

function NoteList({ notes }) {
    const [editableNotes, setEditableNotes] = useState(notes);
    const titleRefs = useRef([]);
    const contentRefs = useRef([]);

    useEffect(() => {
        setEditableNotes(notes);
    }, [notes]);

    const updateNote = async (id, index) => {
        const newTitle = titleRefs.current[index]?.innerText || "";
        const newContent = contentRefs.current[index]?.innerText || "";

        try {
            let accessToken = localStorage.getItem("accessToken");

            let response = await fetch(`${API_URL}/updateNote/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ title: newTitle, content: newContent }),
            });

            if (response.status === 403) {
                const refreshRes = await fetch(`${API_URL}/token`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!refreshRes.ok) throw new Error("Gagal refresh token");

                const dataRefresh = await refreshRes.json();
                const newAccessToken = dataRefresh.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                response = await fetch(`${API_URL}/updateNote/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${newAccessToken}`,
                    },
                    body: JSON.stringify({ title: newTitle, content: newContent }),
                });
            }

            if (response.ok) {
                alert("Note updated successfully");
                // fetchNotes();
            } else {
                alert("Failed to update note");
            }
        } catch (error) {
            console.error("Error updating note:", error);
            alert("Failed to update note");
        }
    };

    const deleteNote = async (id) => {
        try {
            let accessToken = localStorage.getItem("accessToken");

            let response = await fetch(`${API_URL}/deleteNote/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 403) {
                const refreshRes = await fetch(`${API_URL}/token`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!refreshRes.ok) throw new Error("Gagal refresh token");

                const dataRefresh = await refreshRes.json();
                const newAccessToken = dataRefresh.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                response = await fetch(`${API_URL}/deleteNote/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                    },
                });
            }

            if (response.ok) {
                alert("Note deleted successfully");
                // fetchNotes();
                //gunakan logic untuk menghapus note dari state saja
                setEditableNotes((prevNotes) =>
                    prevNotes.filter((note) => note.id !== id)
                );
            } else {
                alert("Failed to delete note");
            }
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("Failed to delete note");
        }
    };

    return (
        <div className="accordion w-100" id="notesAccordion">
            {editableNotes.length > 0 ? (
                editableNotes.map((note, index) => (
                    <div className="accordion-item" key={note.id}>
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#note${index}`}
                            >
                                <h4
                                    className="accordion-title px-3"
                                    ref={(el) => (titleRefs.current[index] = el)}
                                    contentEditable
                                >
                                    {note.title}
                                </h4>
                            </button>
                        </h2>
                        <div id={`note${index}`} className="accordion-collapse collapse">
                            <div className="accordion-body">
                                <p
                                    contentEditable
                                    ref={(el) => (contentRefs.current[index] = el)}
                                >
                                    {note.content}
                                </p>
                                <div className="d-flex gap-3">
                                    <button
                                        className="btn actionButton"
                                        onClick={() => updateNote(note.id, index)}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-outline-danger deleteButton"
                                        onClick={() => deleteNote(note.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <h3 className="text-center mt-3">No notes available</h3>
            )}
        </div>
    );
}

export default NoteList;
