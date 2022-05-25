import RPi.GPIO as gpio
import time
from signal import signal, SIGINT
from sys import exit

def handler(signal_received, frame):
    # on gère un cleanup propre
    print('')
    print('SIGINT or CTRL-C detected. Exiting gracefully')
    gpio.cleanup()
    exit(0)

def main():    
    # GPIO init
    gpio.setmode(gpio.BCM)
    gpio.setup(12, gpio.OUT)

   
    p = gpio.PWM(12, 1000)

    # cycle = 50% c'est ici qu'il faut varier pour augmenter ou diminuer la vitesse du ventillo
    p.start(50)

    # une touche pour quitter le programme.
    input('Appuyez sur une touche pour stopper')

    # La fonction input est bloquante. Si on arrive ici alors on peut fermer le programme
    p.stop()
    gpio.cleanup()


if __name__ == '__main__':
    # On prévient Python d'utiliser la method handler quand un signal SIGINT est reçu
    signal(SIGINT, handler)
    main()