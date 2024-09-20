import "dotenv/config";
import {
  User,
  BankAccount,
  Transaction,
  Category,
  Budget,
  Notification,
  sequelize,
} from "../models/index.js";
import { hash } from "../auth/scrypt.js";

async function seedDatabase() {
  console.log("🔄 Seeding started...");

  try {
    // Synchroniser les modèles avec la base de données
    await sequelize.sync({ force: true });

    // Créer un utilisateur
    const users = await User.bulkCreate([
      {
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@me.com",
        password: await hash("password123"),
        profilPicture: "/uploads/logo.png",
      },
    ]);

    console.log("User created:", users[0].toJSON());

    // Créer des catégories
    const categories = await Category.bulkCreate([
      { name_category: "Alimentation", logo: "alimentation.png" }, // ID 1
      { name_category: "Logement", logo: "logement.png" }, // ID 2
      { name_category: "Loisirs", logo: "loisirs.png" }, // ID 3
      { name_category: "Santé", logo: "sante.png" }, // ID 4
      { name_category: "Transport", logo: "transport.png" }, // ID 5
      { name_category: "Divertissement", logo: "divertissement.png" }, // ID 6
      { name_category: "Autre", logo: "autre.png" }, // ID 7
    ]);

    // Créer des comptes bancaires pour l'utilisateur
    const bankAccounts = await BankAccount.bulkCreate([
      {
        name: "Compte courant",
        initial_balance: 500.0,
        id_user: users[0].id,
      },
      {
        name: "Compte secondaire",
        initial_balance: 1970.0,
        id_user: users[0].id,
      },
    ]);

    console.log(
      "Bank accounts created:",
      bankAccounts.map((account) => account.toJSON())
    );

    // Créer des transactions pour les deux comptes
    const transactionsData = [
      // Transactions pour le compte courant
      {
        transaction_type: "debit",
        amount: 15.0,
        transaction_date: new Date("2024-01-10"),
        description: "Abonnement",
        id_category: categories[5].id, // Divertissement
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 50.0,
        transaction_date: new Date("2024-02-14"),
        description: "Abonnement",
        id_category: categories[5].id, // Divertissement
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 20.0,
        transaction_date: new Date("2024-03-03"),
        description: "Achats divers",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 100.0,
        transaction_date: new Date("2024-04-21"),
        description: "Dépense pour un voyage en Lune de Miel",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[0].id,
      },
      // Transactions pour le livret d'épargne
      {
        transaction_type: "debit",
        amount: 5.0,
        transaction_date: new Date("2024-05-09"),
        description: "Café avec des amis",
        id_category: categories[0].id, // Alimentation
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 200.0,
        transaction_date: new Date("2024-06-15"),
        description: "Concert de musique live",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 300.0,
        transaction_date: new Date("2024-07-23"),
        description: "Dépense pour un gadget inutile",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 500.0,
        transaction_date: new Date("2024-01-15"),
        description: "Revenu Freelance",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 200.0,
        transaction_date: new Date("2024-06-30"),
        description: "Prime de performance",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 100.0,
        transaction_date: new Date("2024-12-05"),
        description: "Bonus de fin d'année",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 15.0,
        transaction_date: new Date("2024-01-10"),
        description: "Abonnement à une application de méditation",
        id_category: categories[5].id, // Divertissement
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 50.0,
        transaction_date: new Date("2024-02-14"),
        description: "Abonnement à un service de streaming",
        id_category: categories[5].id, // Divertissement
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 20.0,
        transaction_date: new Date("2024-03-15"),
        description: "Achat de fournitures pour le jardin",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 100.0,
        transaction_date: new Date("2024-04-25"),
        description: "Dépense pour une sortie au parc d'attractions",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "credit",
        amount: 400.0,
        transaction_date: new Date("2024-05-05"),
        description: "Paiement pour un projet de freelance",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "credit",
        amount: 550.0,
        transaction_date: new Date("2024-06-01"),
        description: "Remboursement d'un prêt",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 80.0,
        transaction_date: new Date("2024-06-20"),
        description: "Dépense pour des articles de sport",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[0].id,
      },

      // Transactions pour le livret d'épargne
      {
        transaction_type: "debit",
        amount: 10.0,
        transaction_date: new Date("2024-07-12"),
        description: "Petite dépense pour des accessoires de voyage",
        id_category: categories[0].id, // Alimentation
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 150.0,
        transaction_date: new Date("2024-08-25"),
        description: "Voyage en weekend avec des amis",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 250.0,
        transaction_date: new Date("2024-09-10"),
        description: "Achat de matériel de camping",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 700.0,
        transaction_date: new Date("2024-10-15"),
        description: "Revenu d'une mission freelance",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 250.0,
        transaction_date: new Date("2024-11-10"),
        description: "Prime annuelle de l'employeur",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 150.0,
        transaction_date: new Date("2024-12-01"),
        description: "Remboursement de dépenses de voyage",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 15.0,
        transaction_date: new Date("2024-01-10"),
        description: "Abonnement",
        id_category: categories[5].id, // Divertissement
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 50.0,
        transaction_date: new Date("2024-02-14"),
        description: "Abonnement",
        id_category: categories[5].id, // Divertissement
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 20.0,
        transaction_date: new Date("2024-03-03"),
        description: "Achats divers",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 100.0,
        transaction_date: new Date("2024-04-21"),
        description: "Dépense pour un voyage en Lune de Miel",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[0].id,
      },
      // Transactions pour le livret d'épargne
      {
        transaction_type: "debit",
        amount: 5.0,
        transaction_date: new Date("2024-05-09"),
        description: "Café avec des amis",
        id_category: categories[0].id, // Alimentation
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 200.0,
        transaction_date: new Date("2024-06-15"),
        description: "Concert de musique live",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 300.0,
        transaction_date: new Date("2024-07-23"),
        description: "Dépense pour un gadget inutile",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 500.0,
        transaction_date: new Date("2024-01-15"),
        description: "Revenu Freelance",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 200.0,
        transaction_date: new Date("2024-06-30"),
        description: "Prime de performance",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 100.0,
        transaction_date: new Date("2024-12-05"),
        description: "Bonus de fin d'année",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 15.0,
        transaction_date: new Date("2024-01-10"),
        description: "Abonnement à une application de méditation",
        id_category: categories[5].id, // Divertissement
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 50.0,
        transaction_date: new Date("2024-02-14"),
        description: "Abonnement à un service de streaming",
        id_category: categories[5].id, // Divertissement
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 20.0,
        transaction_date: new Date("2024-03-15"),
        description: "Achat de fournitures pour le jardin",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 100.0,
        transaction_date: new Date("2024-04-25"),
        description: "Dépense pour une sortie au parc d'attractions",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "credit",
        amount: 300.0,
        transaction_date: new Date("2024-05-05"),
        description: "Paiement pour un projet de freelance",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "credit",
        amount: 150.0,
        transaction_date: new Date("2024-06-01"),
        description: "Remboursement d'un prêt",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[0].id,
      },
      {
        transaction_type: "debit",
        amount: 80.0,
        transaction_date: new Date("2024-06-20"),
        description: "Dépense pour des articles de sport",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[0].id,
      },

      // Transactions pour le livret d'épargne
      {
        transaction_type: "debit",
        amount: 10.0,
        transaction_date: new Date("2024-07-12"),
        description: "Petite dépense pour des accessoires de voyage",
        id_category: categories[0].id, // Alimentation
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 150.0,
        transaction_date: new Date("2024-08-25"),
        description: "Voyage en weekend avec des amis",
        id_category: categories[2].id, // Loisirs
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "debit",
        amount: 250.0,
        transaction_date: new Date("2024-09-10"),
        description: "Achat de matériel de camping",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 700.0,
        transaction_date: new Date("2024-10-15"),
        description: "Revenu d'une mission freelance",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 250.0,
        transaction_date: new Date("2024-11-10"),
        description: "Prime annuelle de l'employeur",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
      {
        transaction_type: "credit",
        amount: 150.0,
        transaction_date: new Date("2024-12-01"),
        description: "Remboursement de dépenses de voyage",
        id_category: categories[6].id, // Autre
        id_bank_account: bankAccounts[1].id,
      },
    ];

    await Transaction.bulkCreate(transactionsData);

    console.log("Transactions created.");

    // Créer des budgets associés aux catégories
    const budgets = await Budget.bulkCreate([
      {
        limitAmount: 500,
        id_category: categories[0].id,
        id_bank_account: bankAccounts[0].id,
      },
      {
        limitAmount: 1500,
        id_category: categories[1].id,
        id_bank_account: bankAccounts[0].id,
      },
      {
        limitAmount: 1000,
        id_category: categories[2].id,
        id_bank_account: bankAccounts[0].id,
      },
      {
        limitAmount: 500,
        id_category: categories[3].id,
        id_bank_account: bankAccounts[0].id,
      },
      {
        limitAmount: 300,
        id_category: categories[4].id,
        id_bank_account: bankAccounts[0].id,
      },
      {
        limitAmount: 300,
        id_category: categories[5].id,
        id_bank_account: bankAccounts[0].id,
      },
      {
        limitAmount: 200,
        id_category: categories[6].id,
        id_bank_account: bankAccounts[0].id,
      },
      {
        limitAmount: 400, // Budget pour le livret d'épargne
        id_category: categories[0].id,
        id_bank_account: bankAccounts[1].id,
      },
    ]);

    console.log("Budgets created.");

    // Créer des notifications pour les budgets dépassés
    for (const budget of budgets) {
      const totalSpent = await Transaction.sum("amount", {
        where: {
          id_category: budget.id_category,
          id_bank_account: budget.id_bank_account,
          transaction_type: "debit",
        },
      });

      const usedPercentage = (totalSpent / budget.limitAmount) * 100;

      if (usedPercentage >= 50) {
        // Si le budget est dépassé à 50% ou plus
        const message = `Votre budget pour la catégorie ${
          categories.find((cat) => cat.id === budget.id_category).name_category
        } est à ${usedPercentage.toFixed(2)}% utilisé !`;

        await Notification.create({
          id_user: users[0].id,
          message,
        });

        console.log(`Notification created: ${message}`);
      }
    }

    console.log("✅ Seeding completed! Database is ready.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    // Fermer la connexion à la base de données
    await sequelize.close();
    console.log("💤 Database connection closed.");
  }
}

// Exécuter la fonction de peuplement de la base de données
seedDatabase();
