import { Router } from "express";
import {
  getTransactions,
  getTransactionsByBankAccount,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsByCategory,
} from "../controllers/transactionController.js";

export const router = Router();

// Route pour récupérer les transactions d'une catégorie et dynamiser le budget
// Place cette route avant celle qui utilise le paramètre :id_bank_account
router.get(
  "/category/:id_category/:bank_account_id",
  getTransactionsByCategory
);

// Route pour récupérer toutes les transactions pour l'utilisateur connecté
router.get("/", getTransactions);

// Route pour récupérer les transactions pour un compte bancaire spécifique
router.get("/:id_bank_account", getTransactionsByBankAccount);

// Route pour créer une nouvelle transaction
router.post("/", createTransaction);

// Route pour modifier une transaction
router.put("/:id", updateTransaction);

// Route pour supprimer une transaction
router.delete("/:id", deleteTransaction);
