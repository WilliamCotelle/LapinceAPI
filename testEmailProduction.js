import { sendEmail } from "./src/utils/emailService";

async function testProductionEmail() {
  try {
    await sendEmail({
      to: "lapinceoclock@gmail.com", // Utilisez votre propre email pour le test
      subject: "Test Email de Production",
      text: "Ceci est un test d'email en configuration de production/staging.",
    });
    console.log("Email de test envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de test:", error);
  }
}

testProductionEmail();
