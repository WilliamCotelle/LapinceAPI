import { randomBytes } from "crypto";

// Génère une clé secrète de 32 octets (256 bits)
const secret = randomBytes(32).toString("hex");
console.log("Votre clé secrète est :", secret);
