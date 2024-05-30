# Procédure pour lancer champiBack_V3 automatiquement au démarrage du Raspberry Pi.

## I ) Modifier le fichier autostart du bureau LXDE

1)  sudo nano /etc/xdg/lxsession/LXDE-pi/autostart

2) Appuyer sur les touches : Ctrl + o (Autoriser l'écriture dans le fichier).

3) Ajouter les commandes suivantes :

@lxpanel --profile LXDE-pi     
@pcmanfm --desktop --profile LXDE-pi 
@xscreensaver -no-splash 
/usr/bin/chromium-browser --kiosk  --disable-restore-session-state http://localhost:3003/

4) Appuyer sur les touches : Ctrl + x (Quitter et enregistrer le fichier).


## II) Lancer le serveur node JS au démarrage .

1) sudo nano /etc/rc.local
2) Appuyer sur les touches : Ctrl + o (Autoriser l'écriture dans le fichier).
3) Commenter les ligne ci dessous : 
# Print the IP address
#_IP=$(hostname -I) || true
#if [ "$_IP" ]; then
#  printf "My IP address is %s\n" "$_IP"
#fi

4) Ajouter la commande suivantes : 
node /home/pi/Desktop/champiBack_V3/server.js 
5) Appuyer sur les touches : Ctrl + x (Quitter et enregistrer le fichier).

## III) Rebooter le raspberry.

1) sudo reboot
