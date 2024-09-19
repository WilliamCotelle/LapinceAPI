import { User, BankAccount } from "../models/index.js";
import { hash, compare } from "../auth/scrypt.js";
import emailValidator from "email-validator";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";

export const userController = {
  async signup(req, res) {
    const { email, firstName, lastName, password, confirmation } = req.body;

    if (!email || !firstName || !lastName || !password || !confirmation) {
      return res
        .status(400)
        .json({ error: "Tous les champs doivent être renseignés" });
    }

    if (!emailValidator.validate(email)) {
      return res
        .status(400)
        .json({ error: "L'email renseigné n'est pas valide" });
    }

    if (password !== confirmation) {
      return res.status(400).json({
        error: "Le mot de passe et sa confirmation ne sont pas similaires",
      });
    }

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Un utilisateur avec cet email existe déjà" });
      }

      const hashedPassword = await hash(password);

      const newUser = await User.create({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        profilPicture: "/uploads/logo.png",
      });

      // Créer un compte bancaire par défaut pour le nouvel utilisateur
      await BankAccount.create({
        name: "Compte Principal",
        initial_balance: 0, // Vous pouvez définir un solde initial si nécessaire
        id_user: newUser.id,
      });

      return res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .json({ error: "Un utilisateur avec cet email existe déjà" });
      }
      return res.status(500).json({ error: "Une erreur interne est survenue" });
    }
  },

  // Connexion utilisateur
  async signIn(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing fields:", { email, password });
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    // Validez l'email
    if (!emailValidator.validate(email)) {
      console.log("Invalid email:", email);
      return res
        .status(400)
        .json({ error: "L'email renseigné n'est pas valide" });
    }

    try {
      // Trouvez l'utilisateur par email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      // Comparez le mot de passe fourni avec le mot de passe stocké
      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      // Générez un token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          profilPicture: user.profilPicture,
        },
        JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      console.log("Generated token:", token);

      // Retournez le token dans la réponse
      return res.status(200).json({
        message: "Connexion réussie",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bankAccounts: user.bankAccounts,
          profilPicture: user.profilPicture,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return res.status(500).json({ error: "Une erreur interne est survenue" });
    }
  },
};
