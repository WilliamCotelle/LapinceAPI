import express from "express";

//importer tous les controlleurs
import {
  getAllBankAccounts,
  getBankAccountById,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  getUserBankAccounts,
} from "../controllers/bankAccountController.js";

export const router = express.Router();

// Récupérer tous les comptes bancaires
router.get("/", getAllBankAccounts);

// Récupérer un compte bancaire par son ID
router.get("/:id", getBankAccountById);

// Créer un nouveau compte bancaire
router.post("/", createBankAccount);

// Mettre à jour un compte bancaire
router.put("/:id", updateBankAccount);

// Supprimer un compte bancaire
router.delete("/:id", deleteBankAccount);

router.get("/accounts", getUserBankAccounts);
