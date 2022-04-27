//! --------------------------------------------------
OK

Pour supprimer la base de données
DROP DATABASE ma\*base

//--------------------------------------------------------------

# Installer Vs Code :

1. sudo apt update
2. sudo apt install code

# Mises à jour :

3. sudo apt upgrade code

//--------------------------------------------------------------

Installer le module OnOff.
===> npm install onoff
//--------------------------------------------------------------

Installer dépendances.
npm install axios chartjs-adapter-moment concurrently cors dotenv express fs gpio mcp-spi-adc moment mysql mysql2 node-schedule nodemon sequelize winston
//--------------------------------------------------------------

Commande GIT.
GIT PULL
git fetch --all
git reset --hard Origin/master
//--------------------------------------------------------------

I) Installer MariaDB

1. ===> sudo apt update

2. ===> sudo apt upgrade

3. Installer :
   ===> sudo apt-get install mariadb-server mariadb-client.
   . Tapez "Y" et Enter pour continuer.

4. Définir le mot de passe pour l'utilisateur root et commencer à utiliser MariaDB.
   ===> sudo mysql_secure_installation
   . Appuyez sur Entrée pour continuer (pas de mot de passe par défaut)  
   . Tapez ensuite "Y" pour définir un nouveau mot de passe, et entrez le mot de passe de votre choix
   . Maintenant, appuyez trois fois sur "Y" pour :
   . Supprimer les utilisateurs anonymes
   . Interdire la connexion root à distance
   . Supprimer la base de données de test
   . Et enfin, appuyez à nouveau sur "Y" pour recharger les privilèges
   . Ça y est, cette fois MariaDB est prête à être utilisée avec la connexion root

5. Commande pour votre première connexion :
   ===> sudo mysql -uroot -p
   . Entrez ensuite le mot de passe que vous avez défini précédemment

6. Vérifier que le processus est démarré :
   ps -efl | grep mysql

7. Vérifier que le port utilisé par MariaDB (3306 par défaut) est ouvert
   ss -lnt sport = :3306

8. Vérifier l'état du serveur :
   systemctl status mariadb

II) Créer un nouvel utilisateur et une base de données

===> sudo mysql -uroot -p

//--------------------------------------------------------------

https://stackoverflow.com/questions/21944936/error-1045-28000-access-denied-for-user-rootlocalhost-using-password-y

Changer le mot de passe:

1. Arrêtez le serveur MySQL (sous Linux) :
   sudo service mysql stop
   ou
   sudo /usr/local/mysql/support-files/mysql.server stop

2. Démarrez-le en mode sans échec :
   sudo mysqld_safe --skip-grant-tables --skip-networking

Ce sera une commande en cours jusqu'à ce que le processus soit terminé.

3. Ouvrez une autre fenêtre shell/terminal, connectez-vous sans mot de passe :
   mysql -u root

4. Coller cette ligne :
   update mysql.user set authentication_string='champi' where user='root';

5. Démarrez MySQL en utilisant :
   sudo service mysql start
   ou
   sudo /usr/local/mysql/support-files/mysql.server start

//--------------------------------------------------------------

Créer un utilisateur sous MySQL / MariaDB :

1. Pour commencer connectez-vous à votre base de données avec les droits administrateurs (root).
   mysql -u root -p

2. Une fois connecter à la base de données on créera un utilisateur :

CREATE USER 'idric'@'localhost' IDENTIFIED BY 'Kup33uC4W6';

3. On donne ensuite tous les droits :
   GRANT ALL PRIVILEGES ON x.x TO 'idric'@'localhost' WITH GRANT OPTION;

   FLUSH PRIVILEGES;

4. Créé de base de données
   CREATE DATABASE champyresi DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

//--------------------------------------------------------------

Informations de version du moteur MySQL / MariaDB
SHOW GLOBAL VARIABLES LIKE '%version%';

Obtenir la version du moteur : 10.3.31-MariaDB-0+deb10u1
SELECT @@version;

Afficher la liste des user :
SELECT User, Host FROM mysql.user;

Renommer un utilisateur :
RENAME USER 'user'@'localhost' TO 'user2'@'localhost';

Changer un mot de passe :
SET PASSWORD FOR 'user'@'localhost' = PASSWORD('newpassword');

Suppression Utilisateur :
DROP USER 'user'@'localhost';

//--------------------------------------------------------------

Aperçu de la répartition de la mémoir
free -h

//! Compilation du code Javascript.

browserify /home/pi/Desktop/champiBack_V2/gestion/gestionCourbes/courbes.js > bundle.js

//!--------------------------------------------------------------

Obtenir des informations sur le système d’exploitation exécuté sur un Raspberry : cat /etc/os-release

//!--------------------------------------------------------------

Numéro de sous-version pour Debian : cat /etc/debian_version

Architecture utilisée sur l'appareil : uname -m

//!--------------------------------------------------------------

La distribution en cours d’exécution : lsb_release -a

//!--------------------------------------------------------------

Kernel version: montre les informations sur le système : uname -a

PRETTY_NAME="Raspbian GNU/Linux 10 (buster)"
NAME="Raspbian GNU/Linux"
VERSION_ID="10"
VERSION="10 (buster)"
VERSION_CODENAME=buster
ID=raspbian
ID_LIKE=debian
HOME_URL="http://www.raspbian.org/"
SUPPORT_URL="http://www.raspbian.org/RaspbianForums"
BUG_REPORT_URL="http://www.raspbian.org/RaspbianBugs"

pi@Clic974:~ $ uname -m
armv7l

pi@Clic974:~ $ lsb_release -a
No LSB modules are available.
Distributor ID: Raspbian
Description: Raspbian GNU/Linux 10 (buster)
Release: 10
Codename: buster

pi@Clic974:~ $ uname -a
Linux Clic974 5.10.103-v7l+ #1529 SMP Tue Mar 8 12:24:00 GMT 2022 armv7l GNU/Linux

//!--------------------------------------------------------------

Adresse pour tester une requete POST.

https://httpbin.org/post

//!--------------------------------------------------------------
