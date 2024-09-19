// server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { router } from "./src/routers/index.js";
import { errorMiddleware } from "./src/errors/errorMessages.js";
import path from "path";
import { fileURLToPath } from "url";

const port = process.env.PORT || 4000;

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_DOMAINS,
    methods: ["GET", "POST"],
  },
});

// Middleware pour authentifier les connexions WebSocket
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return next(new Error("Authentication error"));
      }
      socket.user = decoded; // Ajoute les informations utilisateur à la connexion socket
      next();
    });
  } else {
    next(new Error("Authentication error"));
  }
});

// Configuration d'Express
app.use(cors({ origin: process.env.ALLOWED_DOMAINS }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

// Gestion des connexions Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  // Gestion de la déconnexion
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use((req, res, next) => {
  res.status(404).send("Sorry, page not found!");
});
server.listen(port, () => {
  console.log(`🚀 Server ready: http://localhost:${port}`);
});
export { io };
