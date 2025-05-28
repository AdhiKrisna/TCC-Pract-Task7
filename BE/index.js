  // ingat untuk set up package.json dengan "type": "module" agar bisa menggunakan ES6 module
  import express from "express"
  import cookieParser from "cookie-parser";
  import cors from "cors"
  import NoteRoute from "./routes/NoteRoute.js"
  const app = express();

  app.use(cookieParser());


  const allowedOrigins = [
    "http://localhost:5173",
    "https://a-09-450915.uc.r.appspot.com"
  ];
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
  }));

  app.use(express.json())
  app.use(NoteRoute)

  app.get("/", (req, res) => {
      res.send("Hello World 123")
  })


  app.listen(
      5000,
      ()=> console.log("Starting Notes App😂😊")
  );
