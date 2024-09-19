import { Notification } from "../models/index.js";

export const getNotifications = async (req, res) => {
  try {
    const id_user = req.user.id;

    const notifications = await Notification.findAll({
      where: { id_user },
      order: [["createdAt", "DESC"]],
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des notifications." });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    const notification = await Notification.findOne({
      where: { id, id_user },
    });

    if (!notification) {
      return res.status(404).json({ error: "Notification non trouvée." });
    }

    notification.is_read = true;
    await notification.save();

    res.json({ message: "Notification marquée comme lue." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la notification." });
  }
};

export const createNotification = async (req, res) => {
  try {
    const { message } = req.body; // Ajoutez budgetId si nécessaire pour l'unicité
    const id_user = req.user.id;

    // Vérifiez s'il existe déjà une notification avec le même message pour le même utilisateur
    const existingNotification = await Notification.findOne({
      where: {
        message,
        id_user,
        is_read: false, // Vérifiez seulement les notifications non lues si nécessaire
      },
    });

    if (existingNotification) {
      return res
        .status(400)
        .json({ message: "Une notification similaire existe déjà." });
    }

    // Créez une nouvelle notification si aucune notification similaire n'existe
    const notification = await Notification.create({
      message,
      id_user,
    });

    res.status(201).json(notification); // Utilisez le code de statut 201 pour une création réussie
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la notification." });
  }
};
