## Informations de version du moteur MySQL / MariaDB

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

# --------------------------------------------------------------

## Aperçu de la répartition de la mémoir

free -h

# --------------------------------------------------------------

# Obtenir des informations sur le système d’exploitation exécuté sur un Raspberry :

cat /etc/os-release

# --------------------------------------------------------------

# Numéro de sous-version pour Debian :

cat /etc/debian_version

# --------------------------------------------------------------

## Architecture utilisée sur l'appareil :

uname -m

# --------------------------------------------------------------

## La distribution en cours d’exécution :

lsb_release -a

# --------------------------------------------------------------

# Kernel version: montre les informations sur le système :

uname -a

# Info raspi

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

# --------------------------------------------------------------

Adresse pour tester une requete POST.

https://httpbin.org/post

# --------------------------------------------------------------

## Demander la version de node.

node -v nodejs

## Installer NodeJs.

apt-get update
apt-get install nodejs

## Mise à jour de la distribution.

apt-get dist-update

## Installation de npm.

apt-get install npm

# --------------------------------------------------------------

## Contenu du fichier configNumSalle

1. Créer le ficheir configNumSalle.js

2. Placer le code ci-dessous

const numSalle = 1;
module.exports = numSalle;

# --------------------------------------------------------------

## Répartition des temps de démarrage du cronTab pour la gestion Co2.

Salle 1 :
Calculs = 00
Consigne automatique Co2 = 01

Salle 2 :
Calculs = 05
Consigne automatique Co2 = 06

Salle 3 :
Calculs = 10
Consigne automatique Co2 = 11

Salle 4 :
Calculs = 15
Consigne automatique Co2 = 16

Salle 5 :
Calculs = 20
Consigne automatique Co2 = 21

Salle 6 :
Calculs = 25
Consigne automatique Co2 = 26

# --------------------------------------------------------------

intaller le logiciel printsaver

## Le mode veille.

sudo apt-get install xscreensaver

## Infos :

Adresse IP du routeur r480t+
192.168.0.1
User name. admin
MDP champyresi

## Pour modifier la adresse mac.

Il faut aller dans
Network>lan>adresse revervation

Pour trouver l adresse mac du raspi c est
Ifconfig

## ---------------------------------------------------

## Taux d'ouverture.

40 000	40 000	100,00
35 000	40 000	87,50
30 000	40 000	75,00
25 000	40 000	62,50
20 000	40 000	50,00
15 000	40 000	37,50
10 000	40 000	25,00
5 000	40 000	12,50
2 000	40 000	5,00

## ---------------------------------------------------

## Sondes.

Température Sub = 2
Température Sec = 0
Température Hum = 1
Température Air = 0 

## ---------------------------------------------------
