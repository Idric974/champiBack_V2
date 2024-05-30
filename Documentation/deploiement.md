# PROCÉDURE DE DÉPLOIEMENT

## Vérifier si le port SPI est activé.

1) Sur le Raspi :
Préférence ⇒ Configuration du Raspberry Pi ⇒ Interface ⇒ SPI cocher Activé

2) En ligne de commande : 
1. sudo raspi-config 
2. Sélectionnez « Options d’interfaçage »
3. Mettez en surbrillance l’option « SPI » et activez «  ».
4. Sélectionnez et activez «  » :
5. Cliquez sur yes.
6. Lorsque vous êtes invité à redémarrer, mettez en surbrillance et activez «  ».



## 1) Mise à jour du Raspberry.

1. ===> sudo apt update
2. ===> sudo apt upgrade

## 2) Puller le code.

1. ChampiBack V2.
   https://github.com/Idric974/champiBack_V3.git

2. Champi Etalonnage.
   https://github.com/Idric974/champiEtalonnage.git

## 3) Installer Vs Code.

===> sudo apt install code

## 4) Installer MariaDB.

1. Installer : Utiliser un terminale hors vs-code.
   ===> sudo apt-get install mariadb-server mariadb-client.
   . Tapez "Y" et Enter pour continuer.

2. Définir le mot de passe pour l'utilisateur root et commencer à utiliser MariaDB.
   ===> sudo mysql_secure_installation
   . Appuyez sur Entrée pour continuer (pas de mot de passe par défaut).  
   . Tapez ensuite "Y" pour définir un nouveau mot de passe, et entrez le mot de passe de votre choix.
   . Maintenant, appuyez trois fois sur "Y" pour :
   Supprimer les utilisateurs anonymes.
   Interdire la connexion root à distance.
   Supprimer la base de données de test.
   Et enfin, appuyez à nouveau sur "Y" pour recharger les privilèges.
   Ça y est, cette fois MariaDB est prête à être utilisée avec la connexion root.

3. Commande pour votre première connexion :
   ===> sudo mysql -uroot -p
   Entrez ensuite le mot de passe que vous avez défini précédemment

4. Vérifier que le processus est démarré :
   ps -efl | grep mysql

5. Vérifier que le port utilisé par MariaDB (3306 par défaut) est ouvert
   ss -lnt sport = :3306

6. Vérifier l'état du serveur :
   systemctl status mariadb

## 5) Créer un nouvel utilisateur et une base de données

===> sudo mysql -uroot -p

## 6) Créer un utilisateur sous MySQL / MariaDB :

1. Pour commencer connectez-vous à votre base de données avec les droits administrateurs (root).
   mysql -u root -p

2. Une fois connecter à la base de données on créera un utilisateur :

CREATE USER 'idric'@'localhost' IDENTIFIED BY 'Kup33uC4W6';

3. On donne ensuite tous les droits :
   GRANT ALL PRIVILEGES ON ⭐.⭐ TO 'idric'@'localhost' WITH GRANT OPTION;

   FLUSH PRIVILEGES;

4. Créé de base de données
   CREATE DATABASE champyresi DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

   ## 8) Création des table en utilisant SQL. (12 Tables à créer)

5. **gestion Air.**
   gestion_airs
   gestion_airs_data
   gestion_airs_etalonnage
   gestion_airs_etat_relays

6. **Gestion Humidité.**
   gestion_hums
   gestion_hums_datas
   gestion_hums_etalonnage_secs
   gestion_hums_etalonnage_hums

7. **Gestion Co2.**
   gestion_co2s
   gestion_co2s_datas

8. **Gestion des Logs.**
   gestion_logs

9. **Gestion des courbes.**
   gestion_courbes

   ## 9) Mise à jour des table en utilisant SQL.

10. **Gestion Air.**
    ==> Valeurs.
    ==> Data.

11. **Gestion Humidité.**
    ==> Valeurs.
    ==> Data.

12. **Gestion Co2.**
    ==> Valeurs.
    ==> Data.

13. **Etalonnage.**
    ==> Air
    ==> Hum Sec
    ==> Hum Hum

14. **Etat relay.**

## 7) Installer dépendances.

1.  npm install axios
2.  npm install chartjs-adapter-moment
3.  npm install concurrently
4.  npm install cors
5.  npm install dotenv
6.  npm install express
7.  npm install fs
8.  npm install gpio
9.  npm install mcp-spi-adc
10. npm install moment
11. npm install mysql
12. npm install mysql2
13. npm install node-schedule
14. npm install nodemon
15. npm install sequelize
16. npm install winston
17. npm install onoff


OK
