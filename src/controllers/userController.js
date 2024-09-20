import { User, BankAccount } from "../models/index.js";
import { hash, compare } from "../auth/scrypt.js";
import emailValidator from "email-validator";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.js";

export const userController = {
  async signup(req, res) {
    const { email, firstName, lastName, password, confirmation } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (
      !normalizedEmail ||
      !firstName ||
      !lastName ||
      !password ||
      !confirmation
    ) {
      return res
        .status(400)
        .json({ error: "Tous les champs doivent être renseignés" });
    }

    if (!emailValidator.validate(normalizedEmail)) {
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
      const existingUser = await User.findOne({
        where: { email: normalizedEmail },
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "Un utilisateur avec cet email existe déjà" });
      }

      const hashedPassword = await hash(password);

      const newUser = await User.create({
        email: normalizedEmail,
        firstName,
        lastName,
        password: hashedPassword,
        profilPicture: "/uploads/logo.png",
      });

      await BankAccount.create({
        name: "Compte Principal",
        initial_balance: 0,
        id_user: newUser.id,
      });

      // Générer le token JWT
      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          profilPicture: newUser.profilPicture,
        },
        JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      // Retourner la réponse avec le token et les informations utilisateur
      return res.status(201).json({
        message: "Utilisateur créé avec succès",
        token, // Ajouter le token à la réponse
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          profilPicture: newUser.profilPicture,
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

  async signIn(req, res) {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    if (!normalizedEmail || !password) {
      console.log("Missing fields:", { email: normalizedEmail, password });
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    if (!emailValidator.validate(normalizedEmail)) {
      console.log("Invalid email:", normalizedEmail);
      return res
        .status(400)
        .json({ error: "L'email renseigné n'est pas valide" });
    }

    try {
      const user = await User.findOne({ where: { email: normalizedEmail } });
      if (!user) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ error: "Email ou mot de passe incorrect" });
      }

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
