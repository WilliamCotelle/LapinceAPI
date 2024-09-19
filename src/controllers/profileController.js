import { User } from "../models/index.js";
import { hash, compare } from "../auth/scrypt.js";
import emailValidator from "email-validator";
import { errorMessages, passwordRegex } from "../errors/errorMessages.js";
import fs from "fs/promises";
import path from "path";

export const profileEditController = {
  async updateProfile(req, res, next) {
    const { id } = req.user;
    const {
      email,
      firstName,
      lastName,
      oldPassword,
      newPassword,
      confirmation,
    } = req.body;

    try {
      // Vérification des champs obligatoires
      if (!email)
        return res.status(400).json({ error: errorMessages.email.required });
      if (!firstName)
        return res
          .status(400)
          .json({ error: errorMessages.firstName.required });
      if (!lastName)
        return res.status(400).json({ error: errorMessages.lastName.required });

      // Validation de l'email
      if (!emailValidator.validate(email)) {
        return res.status(400).json({ error: errorMessages.email.invalid });
      }

      // Validation de la longueur du prénom et du nom
      if (firstName.length < 2)
        return res.status(400).json({ error: errorMessages.firstName.min });
      if (firstName.length > 50)
        return res.status(400).json({ error: errorMessages.firstName.max });
      if (lastName.length < 2)
        return res.status(400).json({ error: errorMessages.lastName.min });
      if (lastName.length > 50)
        return res.status(400).json({ error: errorMessages.lastName.max });

      const user = await User.findByPk(id);
      if (!user)
        return res.status(404).json({ error: "Utilisateur non trouvé" });

      // Vérification si l'email est déjà utilisé par un autre utilisateur
      if (email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res
            .status(400)
            .json({ error: "Cet email est déjà utilisé par un autre compte" });
        }
      }

      // Mise à jour du mot de passe si nécessaire
      if (oldPassword || newPassword || confirmation) {
        // Vérifier que tous les champs nécessaires pour le changement de mot de passe sont présents
        if (!oldPassword || !newPassword || !confirmation) {
          return res.status(400).json({
            error:
              "Tous les champs de mot de passe sont requis pour le changement",
          });
        }

        const isPasswordValid = await compare(oldPassword, user.password);
        if (!isPasswordValid) {
          return res
            .status(400)
            .json({ error: "L'ancien mot de passe est incorrect" });
        }

        if (newPassword.length < 8)
          return res.status(400).json({ error: errorMessages.password.min });
        if (newPassword.length > 50)
          return res.status(400).json({ error: errorMessages.password.max });

        if (!passwordRegex.test(newPassword)) {
          return res
            .status(400)
            .json({ error: errorMessages.password.pattern });
        }

        if (newPassword !== confirmation) {
          return res
            .status(400)
            .json({ error: errorMessages.confirmation.match });
        }

        user.password = await hash(newPassword);
      }

      // Mise à jour des autres champs du profil
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;

      await user.save();

      return res.status(200).json({
        message: "Profil mis à jour avec succès",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      return res.status(500).json({
        error: "Une erreur est survenue lors de la mise à jour du profil",
      });
    }
  },

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        attributes: ["email", "firstName", "lastName", "profilPicture"],
      });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Utilisateur non trouvé" });
      }
      res.json({
        success: true,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          profilPicture: user.profilPicture,
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du profil :", error);
      res.status(500).json({ success: false, message: "Erreur serveur" });
    }
  },

  async uploadProfilePhoto(req, res) {
    try {
      const { id } = req.user;

      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier téléchargé" });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      if (user.profilPicture && user.profilPicture !== "/uploads/logo.png") {
        const oldImagePath = path.join(
          process.cwd(),
          "uploads",
          path.basename(user.profilPicture)
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          if (err.code !== "ENOENT") {
            console.error(
              "Erreur lors de la suppression de l'ancienne image :",
              err
            );
          }
        }
      }

      user.profilPicture = `/uploads/${req.file.filename}`;
      await user.save();

      return res.status(200).json({
        message: "Photo de profil mise à jour avec succès",
        user: {
          id: user.id,
          profilPicture: user.profilPicture,
        },
      });
    } catch (error) {
      console.error(
        "Erreur lors du téléchargement de la photo de profil :",
        error
      );
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
};
