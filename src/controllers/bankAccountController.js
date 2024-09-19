import BankAccount from "../models/bankAccount.js";

// Récupérer tous les comptes bancaires
export const getAllBankAccounts = async (req, res) => {
  try {
    // récupérer tous les comptes bancaires dans la base de données
    const bankAccounts = await BankAccount.findAll();
    //retroune tout les compte bancaire en json avec un code 200
    res.status(200).json(bankAccounts);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

export const getUserBankAccounts = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    // Inclure les données associées (si nécessaire)
    const bankAccounts = await BankAccount.findAll({
      where: { id_user: userId },
    });

    if (!bankAccounts || bankAccounts.length === 0) {
      return res.status(404).json({ message: "Aucun compte bancaire trouvé" });
    }

    res.status(200).json(bankAccounts);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des comptes bancaires :",
      error
    );
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

//Récupérer un compte bancaire par son ID

export const getBankAccountById = async (req, res) => {
  const { id } = req.params;
  try {
    //chercher le compte bancaire dans la base de données par son ID
    const bankAccount = await BankAccount.findByPk(id);
    // verifie si le compte bancaire existe
    if (!bankAccount) {
      return res.status(404).json({ message: "Compte bancaire non trouvé" });
    }
    //retourne le compte bancaire
    res.status(200).json(bankAccount);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

// Créer un nouveau compte bancaire
export const createBankAccount = async (req, res) => {
  try {
    // Créer un nouveau compte bancaire
    const bankAccount = await BankAccount.create(req.body);
    res.status(201).json(bankAccount);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

//Modifier un compte bancaire
export const updateBankAccount = async (req, res) => {
  try {
    //crée un tableau qui contient les colonnes à mettre à jour
    const [updated] = await BankAccount.update(req.body, {
      where: { id: req.params.id },
    });
    if (!updated) {
      return res.status(404).json({ message: "Compte bancaire non trouvé" });
    }
    // verifier si le compte bancaire a été modifié
    const updatedBankAccount = await BankAccount.findByPk(req.params.id);
    res.status(200).json(updatedBankAccount);
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};

//Supprimer un compte bancaire
export const deleteBankAccount = async (req, res) => {
  try {
    //supprimer le compte bancaire
    const deleted = await BankAccount.destroy({
      //supprimer le compte bancaire par son ID
      where: { id: req.params.id },
    });
    //verifier si le compte bancaire a été trouvé
    if (!deleted) {
      return res.status(404).json({ message: "Compte bancaire non trouvé" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Une erreur est survenue" });
  }
};
