import { User } from "../models/index.js";
import { hash } from "../auth/scrypt.js";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "../utils/emailService.js";

export const forgotPasswordController = {
  async sendResetEmail(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res
          .status(404)
          .json({ message: "Aucun utilisateur trouvé avec cet email." });
      }

      const resetToken = uuidv4();
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
      await user.save();

      const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

      await sendEmail({
        to: user.email,
        subject: "Réinitialisation de votre mot de passe",
        text: `Pour réinitialiser votre mot de passe, cliquez sur ce lien : ${resetUrl}`,
      });

      res.json({ message: "Un email de réinitialisation a été envoyé." });
    } catch (error) {
      console.error(
        `Erreur lors de l'envoi de l'email de réinitialisation:`,
        error
      );
      res.status(500).json({
        message: "Erreur lors de l'envoi de l'email de réinitialisation.",
      });
    }
  },

  async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    try {
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: new Date() },
        },
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Le token est invalide ou a expiré." });
      }
      user.password = await hash(newPassword);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      res.json({
        message: "Votre mot de passe a été réinitialisé avec succès.",
      });
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error
      );
      res.status(500).json({
        message: "Erreur lors de la réinitialisation du mot de passe.",
      });
    }
  },
};
