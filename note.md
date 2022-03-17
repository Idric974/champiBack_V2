//⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐⭐
//--------------------------------------------------------------

GIT PULL

git fetch --all

git reset --hard Origin/master

//----------------------------------

les couleurs :
export const reset = "\x1b[0m"
export const bright = "\x1b[1m"
export const dim = "\x1b[2m"
export const underscore = "\x1b[4m"
export const blink = "\x1b[5m"
export const reverse = "\x1b[7m"
export const caché = "\x1b[8m"

export const noir = "\x1b[30m"
export const rouge = "\x1b[31m"
export const vert = "\x1b[32m"
export const jaune = "\x1b[33m"
export const bleu = "\x1b[34m"
export const magenta = "\x1b[35m"
export const cyan = "\x1b[36m"
export const blanc = "\x1b[37m"

export const BGblack = "\x1b[40m"
export const BGred = "\x1b[41m"
export const BGgreen = "\x1b[42m"
export const BGyellow = "\x1b[43m"
export const BGblue = "\x1b[44m"
export const BGmagenta = "\x1b[45m"
export const BGcyan = "\x1b[46m"
export const BGwhite = "\x1b[47m"

//----------------------------------

1. Installer :
   sudo apt-get install mariadb-server mariadb-client

2. Vérifier que le processus est démarré :
   ps -e | grep mysql

3. Vérifier que le port utilisé par MariaDB (3306 par défaut) est ouvert
   ss -lnt sport = :3306

4. Vérifier l'état du serveur :
   systemctl status mariadb

//----------------------------------
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

//----------------------------------

Créer un utilisateur sous MySQL / MariaDB :

1. Pour commencer connectez-vous à votre base de données avec les droits administrateurs (root).
   mysql -u root -p

2. Une fois connecter à la base de données on créera un utilisateur :

CREATE USER 'idric'@'localhost' IDENTIFIED BY 'Kup33uC4W6';

3. On donne ensuite tous les droits :
   GRANT ALL PRIVILEGES ON dinath.\* TO 'idric'@'localhost' WITH GRANT OPTION;

   FLUSH PRIVILEGES;

4. Créé de base de données
   CREATE DATABASE 'database' DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

//----------------------------------

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

//----------------------------------

Aperçu de la répartition de la mémoir
free -h

'
