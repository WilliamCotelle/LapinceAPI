import bcrypt from "bcrypt";

const saltRounds = 10; // Nombre de tours de salage standard

/**
 * Hasher un mot de passe avec bcrypt
 *
 * @param {string} password - Le mot de passe en clair à hasher
 * @returns {Promise<string>} - Le mot de passe hashé
 */
export const hash = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds);
  } catch (err) {
    throw new Error("Erreur lors du hashage du mot de passe : " + err.message);
  }
};

/**
 * Comparer un mot de passe avec un mot de passe hashé
 *
 * @param {string} password - Le mot de passe en clair
 * @param {string} hashedPassword - Le mot de passe hashé à comparer
 * @returns {Promise<boolean>} - Renvoie true si les mots de passe correspondent, sinon false
 */
export const compare = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    throw new Error(
      "Erreur lors de la comparaison du mot de passe : " + err.message
    );
  }
};
