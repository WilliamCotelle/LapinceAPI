import {
  Transaction,
  BankAccount,
  Category,
  Budget,
  Notification,
} from "../models/index.js";
import { io } from "../../server.js";

// Récupérer toutes les transactions pour un utilisateur spécifique
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const bankAccounts = await BankAccount.findAll({
      where: { id_user: userId },
    });

    if (!bankAccounts.length) {
      return res
        .status(404)
        .json({ message: "Aucun compte bancaire trouvé pour cet utilisateur" });
    }

    const bankAccountIds = bankAccounts.map((account) => account.id);
    const transactions = await Transaction.findAll({
      where: { id_bank_account: bankAccountIds },
    });

    res.status(200).json(transactions); // Code 200 pour les récupérations réussies
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Récupérer les transactions pour un compte bancaire spécifique
export const getTransactionsByBankAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id_bank_account } = req.params;

    const bankAccount = await BankAccount.findOne({
      where: { id: id_bank_account, id_user: userId },
    });

    if (!bankAccount) {
      return res
        .status(403)
        .json({ message: "Accès non autorisé au compte bancaire" });
    }

    const transactions = await Transaction.findAll({
      where: { id_bank_account },
    });
    res.status(200).json(transactions); // Code 200 pour les récupérations réussies
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      id_bank_account,
      transaction_type,
      amount,
      id_category,
      description,
    } = req.body;

    // Validation des données d'entrée
    if (!id_bank_account || !transaction_type || !amount) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    // Vérifier que le compte bancaire appartient bien à l'utilisateur
    const bankAccount = await BankAccount.findOne({
      where: { id: id_bank_account, id_user: userId },
    });

    if (!bankAccount) {
      return res
        .status(403)
        .json({ message: "Accès non autorisé au compte bancaire" });
    }

    // Calculer le nouveau solde en fonction du type de transaction
    let newBalance = parseFloat(bankAccount.initial_balance);
    if (transaction_type === "credit") {
      newBalance += parseFloat(amount);
    } else if (transaction_type === "debit") {
      newBalance -= parseFloat(amount);
    } else {
      return res.status(400).json({ message: "Type de transaction invalide" });
    }

    // Mettre à jour le solde du compte bancaire
    await bankAccount.update({ initial_balance: newBalance });

    // Créer la transaction
    const transaction = await Transaction.create({
      id_bank_account: bankAccount.id,
      id_category,
      transaction_type,
      amount,
      description,
      transaction_date: new Date(),
    });

    // Vérifier s'il y a un budget lié à la catégorie de la transaction
    const budget = await Budget.findOne({
      where: { id_category, id_bank_account: bankAccount.id },
      include: [{ model: Category, as: "category" }],
    });

    if (budget) {
      // Récupérer les transactions existantes pour cette catégorie
      const transactions = await Transaction.findAll({
        where: { id_category, id_bank_account: bankAccount.id },
      });

      // Calculer le total des dépenses pour cette catégorie
      const totalSpent = transactions.reduce((sum, txn) => {
        if (txn.transaction_type === "debit") {
          return sum + parseFloat(txn.amount);
        }
        return sum;
      }, 0);

      const usedPercentage = (totalSpent / budget.limitAmount) * 100;

      // Vérifier si le budget est dépassé
      if (usedPercentage >= 50 && !budget.notificationSent) {
        const message = `Votre budget pour la catégorie ${
          budget.category.name_category
        } est à ${usedPercentage.toFixed(2)}% utilisé !`;

        // Enregistrer la notification dans la base de données
        const notification = await Notification.create({
          id_user: userId,
          message,
        });

        // Enregistrer l'ID de la notification
        const notificationId = notification.id;

        // Émettre la notification via Socket.io avec l'ID
        io.emit("notification", {
          id: notificationId,
          userId,
          message,
        });
      }
    }

    res.status(201).json(transaction); // Retourner la transaction créée
  } catch (error) {
    console.error("Erreur lors de la création de la transaction:", error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue", error: error.message });
  }
};

// Modifier une transaction
export const updateTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const [updated] = await Transaction.update(req.body, {
      where: { id, id_user: userId },
    });

    if (!updated) {
      return res.status(404).json({ message: "Transaction non trouvée" });
    }

    const updatedTransaction = await Transaction.findByPk(id);
    res.status(200).json(updatedTransaction); // Code 200 pour les mises à jour réussies
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};
// Supposons que vous ayez une fonction pour recalculer le solde
const updateAccountBalance = async (accountId) => {
  // Récupérer toutes les transactions pour le compte spécifié
  const transactions = await Transaction.findAll({
    where: { id_bank_account: accountId },
  });

  // Calculer le nouveau solde en fonction des transactions
  const updatedBalance = transactions.reduce((balance, tx) => {
    return tx.transaction_type === "credit"
      ? balance + parseFloat(tx.amount)
      : balance - parseFloat(tx.amount);
  }, 0);

  // Mettre à jour le solde du compte bancaire
  await BankAccount.update(
    { initial_balance: updatedBalance },
    { where: { id: accountId } }
  );
};

// Supprimer une transaction
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'ID de l'utilisateur authentifié
    const { id } = req.params; // Récupérer l'ID de la transaction à supprimer

    // Trouver la transaction à supprimer et vérifier qu'elle appartient à l'utilisateur
    const transaction = await Transaction.findOne({
      where: { id },
      include: [
        {
          model: BankAccount,
          as: "bankAccount",
          where: { id_user: userId },
        },
      ],
    });

    if (!transaction) {
      // Si la transaction n'est pas trouvée ou n'appartient pas à l'utilisateur
      return res
        .status(404)
        .json({ message: "Transaction non trouvée ou accès non autorisé" });
    }

    const accountId = transaction.id_bank_account;

    // Supprimer la transaction
    await Transaction.destroy({ where: { id } });

    // Mettre à jour le solde du compte bancaire
    await updateAccountBalance(accountId);

    // Répondre avec un statut 204 (No Content) pour indiquer la réussite de la suppression
    res.status(204).send();
  } catch (error) {
    // Log de l'erreur et réponse avec un message d'erreur générique
    console.error("Erreur lors de la suppression de la transaction :", error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la suppression de la transaction",
    });
  }
};

export const getTransactionsByCategory = async (req, res) => {
  const { id_category, bank_account_id } = req.params;

  try {
    // Récupérer la catégorie avec les transactions associées pour le compte bancaire spécifique
    const category = await Category.findByPk(id_category, {
      include: [
        {
          model: Transaction,
          as: "transactions",
          where: {
            transaction_type: "debit",
            id_bank_account: bank_account_id, // Filtrer par compte bancaire
          },
          required: false, // Permet de retourner les catégories sans transactions aussi
        },
        {
          model: Budget,
          as: "budget",
          where: { id_bank_account: bank_account_id }, // Filtrer le budget par compte bancaire
        },
      ],
    });

    if (!category || !category.budget) {
      return res.status(404).json({
        message: "Catégorie ou budget introuvable pour ce compte bancaire",
      });
    }

    // Calculer le montant total dépensé pour cette catégorie
    const totalSpent = category.transactions.reduce(
      (acc, transaction) => acc + parseFloat(transaction.amount),
      0
    );

    // Calculer le budget restant
    const remainingBudget = category.budget.limitAmount - totalSpent;

    // Envoyer les informations pertinentes au client
    return res.status(200).json({
      message: "Transactions et budget récupérés avec succès",
      transactions: category.transactions,
      totalSpent,
      remainingBudget,
      budgetLimit: category.budget.limitAmount,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Erreur lors de la récupération des transactions : ${error.message}`,
    });
  }
};
