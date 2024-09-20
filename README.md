# projet-la-pince-back


## 1. Cloner le dépot localement

```bash
git@github.com:O-clock-Pizza/projet-la-pince-back.git
```

## 2. Initialisation des Branches Principales

### Étape 1 : Créer la branche `develop`

La branche `develop` est la branche où vous allez intégrer toutes les nouvelles fonctionnalités avant de les fusionner dans la branche `main`.

1. Créez et basculez sur la branche `develop` :
   ```bash
   git checkout -b develop
   ```
2. Poussez la branche `develop` vers le dépôt distant :
   ```bash
   git push origin develop
   ```

## 3. Création d’une Branche de Fonctionnalité (Feature Branch)

Chaque nouvelle fonctionnalité doit être développée dans une branche spécifique. Cela permet à chacun de travailler indépendamment sur sa fonctionnalité sans affecter les autres.

### Étape 1 : Créer une branche de fonctionnalité

Supposons que vous voulez travailler sur une fonctionnalité d’ajout de dépense. Créez une nouvelle branche `feature/ajout-depense` à partir de `develop` :

```bash
git checkout develop
git checkout -b feature/ajout-depense
```

### Étape 2 : Travailler sur la fonctionnalité

Maintenant que vous êtes sur la branche `feature/ajout-depense`, vous pouvez commencer à coder. Faites des commits réguliers pour sauvegarder vos modifications.

```bash
git add .
git commit -m "Ajout de la fonctionnalité pour l'ajout de dépense"
```

## 4. Intégration des Modifications dans la Branche `develop`

Une fois que la fonctionnalité est prête et testée localement, vous devez intégrer votre travail dans la branche `develop`.

### Étape 1 : Mettre à jour `develop`

Avant de fusionner, assurez-vous que votre branche `develop` locale est à jour avec la version distante :

```bash
git checkout develop
git pull origin develop
```

### Étape 2 : Fusionner la branche de fonctionnalité dans `develop`

Après avoir mis à jour `develop`, vous pouvez fusionner votre branche `feature/ajout-depense` :

```bash
git checkout develop
git merge feature/ajout-depense
```

### Étape 3 : Résoudre les conflits (si nécessaire)

Il se peut que vous ayez des conflits lors de la fusion. Si c’est le cas, Git vous indiquera les fichiers en conflit, et vous devrez les corriger manuellement avant de continuer.

### Étape 4 : Pousser `develop` vers le dépôt distant

Une fois la fusion terminée, poussez les modifications sur le dépôt distant :

```bash
git push origin develop
```

### Étape 5 : Supprimer la branche de fonctionnalité

Après avoir fusionné votre fonctionnalité, vous pouvez supprimer la branche `feature/ajout-depense` pour garder votre espace de travail propre :

```bash
git branch -d feature/ajout-depense
```

## 5. Fusion de `develop` dans `main`

Lorsque toutes les fonctionnalités prévues pour une version sont prêtes et testées, vous pouvez fusionner `develop` dans `main` pour préparer le déploiement.

### Étape 1 : Basculer sur la branche `main`

Assurez-vous que `develop` est à jour, puis basculez sur `main` :

```bash
git checkout main
```

### Étape 2 : Fusionner `develop` dans `main`

Fusionnez maintenant la branche `develop` dans `main` :

```bash
git merge develop
```

### Étape 3 : Pousser `main` vers le dépôt distant

Enfin, poussez les modifications vers le dépôt distant pour que `main` soit à jour :

```bash
git push origin main
```
