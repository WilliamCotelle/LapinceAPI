import { BankAccount } from "../models/index.js";
import { Transaction } from "../models/index.js";
import { User } from "../models/index.js";
import { Category } from "../models/index.js";
import { Budget } from "../models/index.js";

export const dashboardController = {
  async getDashboardData(req, res) {
    const userId = req.user.id; // Récupérer l'ID de l'utilisateur depuis le JWT

    try {
      // Récupérer l'utilisateur avec ses comptes bancaires et les transactions associées
      const userData = await User.findByPk(userId, {
        include: [
          {
            model: BankAccount,
            as: "bankAccounts",
            include: [
              {
                model: Transaction,
                as: "transactions",
                include: [
                  {
                    model: Category,
                    as: "category",
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!userData) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      return res.status(200).json({
        message: "Données du dashboard récupérées avec succès",
        user: userData,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données du dashboard :",
        error
      );
      return res.status(500).json({ error: "Une erreur interne est survenue" });
    }
  },
};
