import { Budget, Category, BankAccount } from "../models/index.js";

// Créer un nouveau budget
export const createBudget = async (req, res) => {
  const { limitAmount, id_category, id_bank_account } = req.body;

  // Vérifiez que les champs nécessaires sont fournis
  if (!limitAmount || !id_category || !id_bank_account) {
    return res.status(400).json({
      message:
        "Montant limite, ID de catégorie ou ID de compte bancaire manquant",
    });
  }

  // Vérifiez que limitAmount est un nombre positif
  if (limitAmount <= 0) {
    return res
      .status(400)
      .json({ message: "Le montant limite doit être supérieur à zéro" });
  }

  try {
    // Vérifier que la catégorie existe
    const category = await Category.findByPk(id_category);
    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    // Vérifier que le compte bancaire existe
    const bankAccount = await BankAccount.findByPk(id_bank_account);
    if (!bankAccount) {
      return res.status(404).json({ message: "Compte bancaire non trouvé" });
    }

    // Créer le budget avec les données fournies
    const newBudget = await Budget.create({
      limitAmount,
      id_category,
      id_bank_account,
    });

    // Renvoie une réponse avec le nouvel enregistrement
    return res.status(201).json(newBudget);
  } catch (error) {
    // Renvoie une réponse d'erreur en cas de problème
    return res.status(500).json({
      message: `Erreur lors de la création du budget : ${error.message}`,
    });
  }
};

// Récupérer tous les budgets
// Récupérer tous les budgets avec les informations de catégorie
// Récupérer tous les budgets
export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name_category", "logo"],
        },
        {
          model: BankAccount,
          as: "bankAccount", // Assurez-vous que l'alias correspond bien à l'association dans votre modèle
          attributes: ["account_number", "bank_name"], // Sélectionner les champs pertinents
        },
      ],
    });
    return res.status(200).json(budgets);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const getBudgetsByAccount = async (req, res) => {
  try {
    const { accountId } = req.params;
    const userId = req.user.id; // L'ID de l'utilisateur connecté, récupéré depuis le token

    // Vérifiez d'abord si le compte bancaire appartient bien à l'utilisateur connecté
    const bankAccount = await BankAccount.findOne({
      where: { id: accountId, id_user: userId }, // Filtrer par userId pour s'assurer que c'est bien son compte
    });

    if (!bankAccount) {
      return res
        .status(403)
        .json({ message: "Accès interdit. Ce compte ne vous appartient pas." });
    }

    // Ensuite, récupérer les budgets associés au compte bancaire
    const budgets = await Budget.findAll({
      where: { id_bank_account: accountId },
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name_category", "logo"],
        },
        {
          model: BankAccount,
          as: "bankAccount",
          attributes: ["id", "name"],
        },
      ],
    });
    return res.status(200).json(budgets);
  } catch (error) {
    console.error("Erreur lors de la récupération des budgets:", error);
    return res.status(500).json({ message: error.message });
  }
};
// Récupérer un budget par son ID
export const getBudgetById = async (req, res) => {
  const { id } = req.params;
  try {
    const budget = await Budget.findByPk(id, {
      include: { model: Category, as: "category" }, // Inclure la catégorie associée
    });
    if (!budget) {
      return res.status(404).json({ message: "Budget non trouvé" });
    }
    return res.status(200).json(budget);
  } catch (error) {
    return res.status(500).json({
      message: `Erreur lors de la récupération du budget : ${error.message}`,
    });
  }
};

// Mettre à jour un budget existant
export const updateBudget = async (req, res) => {
  const { id } = req.params;
  const { limitAmount, id_category, id_bank_account, notificationSent } =
    req.body;

  try {
    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({ message: "Budget non trouvé" });
    }

    // Vérifier que limitAmount est un nombre positif
    if (limitAmount && limitAmount <= 0) {
      return res
        .status(400)
        .json({ message: "Le montant limite doit être supérieur à zéro" });
    }

    // Vérifiez que la catégorie existe si l'utilisateur souhaite la changer
    if (id_category) {
      const category = await Category.findByPk(id_category);
      if (!category) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }
    }

    // Vérifiez que le compte bancaire existe si l'utilisateur souhaite le changer
    if (id_bank_account) {
      const bankAccount = await BankAccount.findByPk(id_bank_account);
      if (!bankAccount) {
        return res.status(404).json({ message: "Compte bancaire non trouvé" });
      }
    }

    // Mettre à jour les données du budget existant
    budget.limitAmount = limitAmount || budget.limitAmount;
    budget.id_category = id_category || budget.id_category;
    budget.id_bank_account = id_bank_account || budget.id_bank_account;
    if (typeof notificationSent !== "undefined") {
      budget.notificationSent = notificationSent;
    }
    await budget.save();

    return res.status(200).json(budget);
  } catch (error) {
    return res.status(500).json({
      message: `Erreur lors de la mise à jour du budget : ${error.message}`,
    });
  }
};

// Supprimer un budget par son ID
export const deleteBudget = async (req, res) => {
  const { id } = req.params;

  try {
    const budget = await Budget.findByPk(id);
    if (!budget) {
      return res.status(404).json({ message: "Budget non trouvé" });
    }

    await budget.destroy();
    return res.status(200).json({ message: "Budget supprimé avec succès" });
  } catch (error) {
    return res.status(500).json({
      message: `Erreur lors de la suppression du budget : ${error.message}`,
    });
  }
};
