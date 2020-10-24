# Laboratoire sur Docker

## Éxercice 4
Ajouter des fichiers à l'image, monter un répertoire local dans un container, réseau partie 2

### Ajouter des fichiers à une image
Dans l'[éxercice 3][0], nous avons appris que le contenu persiste lorsqu'un container est arrêté. En utilisant un fichier _Dockerfile_ pour construire nos images, nous pouvons exécuter des commandes pour installer des utilitaires. Sur le système hôte, créez un répertoire "dockertest2" et entrez-y puis téléchargez le fichier _Dockerfile_ pour cet éxercice `wget https://raw.githubusercontent.com/matbilodeau/labos-cloud/main/exemples/laboDocker/Dockerfile2`. En vérifiant le contenu, vous remarquerez que deux commandes sont disponibles pour l'ajout de fichiers :

* [COPY][3]
  * Ajoute des fichiers ou répertoires locaux dans le système de fichiers de l'image.
* [ADD][4]
  * Ajoute des fichiers ou répertoires, locaux ou distants, dans le système de fichiers de l'image. Peut décompresser automatiquement les formats d'archivage connus à partir d'une source locale vers un répertoire du système de fichiers de l'image.

Téléchargez le fichier "https://github.com/matbilodeau/labos-cloud/blob/main/exemples/laboDocker/index.html" dans le répertoire local afin de pouvoir l'ajouter lors de la construction. Pour créer un nouveau container, nous avons vu la commande `run` qui inclut plusieurs étapes. Exécutons le tout manuellement.

`sudo docker --help` Pour obtenir l'image de base il faut utiliser la commande `pull`. Pour que *Docker* puisse construire l'image, le fichier _Dockerfile_ doit porter exactement ce nom; renommez-le ainsi: `mv Dockerfile2 Dockerfile`. Vous pouvez mainenant construire votre image avec le nom "monhttpd:v1". Pour créer un container, la commande est `create`.  `sudo docker create --help` liste parmi les options `--name`, ce qui permet de choisir le nom du container plutôt que d'utiliser ceux générés automatiquement. Créez un container à partir de "monhttpd:v1" nommé "test1". Démarrez le container en arrière-plan puis lancez-y un shell _bash_. Vérifiez que le serveur web est fonctionnel pour les deux fichiers.


La [documentation][5] explique pourquoi le fichier "distant.html" n'est pas accessible.

### Monter un répertoire local dans un container



### Réseau partie 2


### Revenir à l'[éxercice 3][1]                  

[0]: ./laboDocker3.html
[1]: ./laboDocker2.html
[3]: https://docs.docker.com/engine/reference/builder/#copy
[4]: https://docs.docker.com/engine/reference/builder/#add
[5]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#add-or-copy
