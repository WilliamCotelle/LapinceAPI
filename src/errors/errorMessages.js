export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=)])[A-Za-z\d@$!%*?&=)]{8,}$/;

export const errorMessages = {
  email: {
    invalid:
      "L'email fourni n'est pas valide. Veuillez entrer un email valide.",
    required: "L'email est requis.",
  },
  firstName: {
    min: "Le prénom doit contenir au moins 2 caractères.",
    max: "Le prénom ne peut pas contenir plus de 50 caractères.",
    required: "Le prénom est requis.",
  },
  lastName: {
    min: "Le nom doit contenir au moins 2 caractères.",
    max: "Le nom ne peut pas contenir plus de 50 caractères.",
    required: "Le nom est requis.",
  },
  password: {
    min: "Le mot de passe doit contenir au moins 8 caractères.",
    max: "Le mot de passe ne peut pas contenir plus de 50 caractères.",
    pattern:
      "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
    required: "Le mot de passe est requis.",
  },
  confirmation: {
    match: "La confirmation du mot de passe ne correspond pas au mot de passe.",
    required: "La confirmation du mot de passe est requise.",
  },
  consent: {
    required: "Vous devez accepter les politiques pour continuer.",
    boolean: "Le consentement doit être un booléen.",
    only: "Vous devez accepter les politiques pour continuer.",
  },
};

export const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack); // Affiche l'empilement des erreurs dans la console

  res.status(err.status || 500).json({
    error: err.message || "Une erreur interne est survenue",
  });
};
