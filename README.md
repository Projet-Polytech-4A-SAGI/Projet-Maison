# Projet Maison Discord

## le bot discord

Cette partie vous expliquera comment créer un bot Discord et le
lier au projet.


### 1. Créez une application Discord

- Si ce n'est pas déjà fait, créez un compte discord    
- Rendez-vous sur le [portail des développeurs Discord](https://discord.com/developers/applications).
- Cliquez sur "New Application" pour créer une nouvelle application.
- Donnez lui un nom et cliquez sur "Create".

### 2. Créez un bot pour votre application

- Dans votre application nouvellement créée, accédez à l'onglet "Bot" dans le menu de gauche.
</br>
- Cliquez sur "Add Bot" pour ajouter un bot à votre application.
</br>
- Dans l'onglet bot, cochez dans la section "Privileged Gateway Intents" l'option "MESSAGE CONTENT INTENT" pour autoriser le bot à lire le contenu des messages envoyés sur le serveur.

### 3. Obtenez les tokens du bot et du serveur

- Dans l'onglet "General informations" de l'application, copiez l'application ID
</br>
- Dans l'onglet "Bot" l'application, sous la section "Token", cliquez sur "Copy" pour copier le token de votre bot. 
<i><small>Assurez-vous de garder ce token privé, en cas de fuite vous recevrez une alerte automatique de discord et votre token ne sera plus utilisable.</small></i>

- Sur discord, allez dans les paramètres dans la section "apparence" puis "avancé"  

- Faites clic droit sur votre serveur pour récupérer l'identifiant du serveur.

- Refaites l'étape précédente pour récupérer l'identifiant du salon o vous voudrez communiquer avec le bot

### 4. Configuration de l'environnement de développement


- Importez le projet sur votre machine
- Créez un fichier .env contenant les variables d'environnement et remplissez le comme ceci : 

```
token = { token bot } 
clientId = {ID de l'application}
guildId = {ID du serveur}
channelId = {ID du salon}
```


### 5. Invitez votre bot sur un serveur Discord

- Retournez sur la page de votre application sur le portail des développeurs Discord.
- Dans l'onglet "OAuth2", cochez la case "bot" dans la section "Scopes".
- Sélectionnez les autorisations nécessaires pour votre bot dans la section "Bot Permissions".
- Copiez le lien généré et ouvrez-le dans votre navigateur web.
- Sélectionnez un serveur où vous souhaitez inviter votre bot et cliquez sur "Authorize".

## Utiliser la simulation et l'IHM
Dans cette partie nous expliquerons comment lancer le reste du projet sur votre ordinateur.

### Instalation préalable
Après avoir cloné le dépot github dans un dossier sur votre ordinateur, étape que vous avez du faire précédement, vous devez lancer la commande ```npm install``` dans le dossier. Cela devrait installer toutes les dépendances nécessaires au projet.

### Lancer le projet
Depuis le dossier, lancez la commande ```node app.js```. Si vous avez configuré correctement les token du .env tout devrait alors fonctionner. Si vous voulez utiliser le projet sans le bot Discord, vous pouvez lancer la commande ```node Express/express.js``` à la place.

## Conclusion

Félicitations ! Vous avez créé et déployé avec succès notre projet . Vous pouvez maintenant manipuler le chauffage, les fenêtres et les lumières comme bon vous semble.
