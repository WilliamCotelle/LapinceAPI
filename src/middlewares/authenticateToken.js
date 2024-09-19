import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";

// middleware pour route privé !
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// middleware pour route SEULEMENT pour les NON CONNECTé
export const ensureNotAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err) => {
      if (!err) {
        return res.status(403).json({ error: "Vous êtes déjà connecté" });
      }
      next();
    });
  } else {
    next();
  }
};
