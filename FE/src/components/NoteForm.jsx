import { useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

import '../styles/NoteForm.css';

const NoteForm = ({ fetchNotes, fetchWithRefresh }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const addNote = async () => {
    if (!title || !content) {
      alert("Title and content cannot be empty!");
      return;
    }
    try {
      const response = await fetchWithRefresh(`${API_URL}/addNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Note added successfully!");
        setTitle("");
        setContent("");
        fetchNotes();
      } else {
        alert("Failed to add note!");
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  return (
    <div className="mb-3">
      <label className="form-label" htmlFor="noteTitleInput"><strong>Note Title</strong></label>
      <input
        type="text"
        className="form-control"
        id="noteTitleInput"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="form-label mt-3" htmlFor="noteContentInput"><strong>Note Content</strong></label>
      <div className="d-flex mb-3 align-items-center justify-content-between">
        <textarea
          className="form-control"
          rows="3"
          id="noteContentInput"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button className="btn ms-3 addNoteButton" onClick={addNote}>Add Note</button>
      </div>
    </div>
  );
};

export default NoteForm;
