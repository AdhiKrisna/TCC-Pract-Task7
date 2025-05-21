import express from "express"
import {getNotes, addNotes, updateNotes, deleteNotes} from "../controllers/NoteController.js"
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  login,
  logout,
} from "../controllers/UserController.js";

import { getAccessToken } from "../controllers/TokenController.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router()

// Endpoint buat ngambil access token menggunakan refresh token
router.get("/token", getAccessToken);

// Endpoint buat login & logout
router.post("/login", login);
router.delete("/logout", logout);
router.post("/register", createUser);

// Kita mau endpoint ini tu restricted,
// alias user yg mau akses endpoint ini harus login dulu,
// makanya kita kasih middleware fungsi verifyToken yg udah kita buat sebelumnya.

router.get("/notes", verifyToken, getNotes)
router.post("/addNote", verifyToken, addNotes)
router.put("/updateNote/:id", verifyToken, updateNotes)
router.delete("/deleteNote/:id", verifyToken, deleteNotes)


export default router