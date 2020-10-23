# Laboratoire sur Docker

## Exercice 3
 de créer une image à partir d'un fichier Dockerfile,  de monter un répertoire local dans un container et de valider l'authenticité des images.

### Système de fichiers partie 2
Dans l'[exercice 1][0], nous avons appris qu'un changement dans le container existe seulement dans le container. Exécutez un container _Debian_ en mode interactif avec un pseudo-terminal. Modifiez le contenu de "/home" comme vu précédemment puis sortez du container. Examinez les containers à l'arrêt. Parmi les différentes commandes listées par `sudo docker --help` et `sudo docker container --help`, vous trouverez `start` et `restart` pour démarrer un container à l'arrêt ou redémarrer un container en cours d'exécution. Démarrez le container _Debian_ avec `sudo docker start <container debian>` puis exécutez-y un shell _bash_. Vérifiez le contenu du répertoire "/home". Le fichier est présent car le contenu persiste quand un container est arrêté ou redémarré.

`

![stop - start][img0]

### Dockerfile
Pour qu'un certain contenu soit présent dans chaque nouveau container créé, il doit faire partie de l'image. Certains utilitaires étant pratiques pour nos tests, ajoutons les directement au départ plutôt que de les réinstaller dans chaque nouveau container. Le fichier [_Dockerfile_][3] contient la liste des commandes à exécuter pour construire le container.

À partir du système hôte, créez un répertoire avec `mkdir dockertest` et entrez-y avec `cd dockertest`. Nous allons utiliser un fichier _Dockerfile_ pré-construit, téléchargez le avec `wget https://raw.githubusercontent.com/matbilodeau/labos-cloud/main/exemples/laboDocker/Dockerfile`. `cat Dockerfile` affichera le contenu du fichier.

* [FROM ][4]
  * Indique à partir de quelle image, locale ou dans un registre, on veut créer la nôtre. Si vous voulez créer vous même des images de base, vous pouvez le faire avec FROM [scratch][5].
* [RUN][6]
  * Exécute une commande dans une nouvelle [couche][7].

En plus de pouvoir créer et démarrer des containers, Docker permet aussi de construire nos images à partir d'un fichier Dockerfile. `sudo docker --help`. La commande dont nous avons besoin est donc `build`, exécutez `sudo docker build .` le "." référant au répertoire courrant.

![pas de nom][img1]

L'image créée n'a pas de nom, il faudra donc toujours y référer par son _IMAGE ID_ ce qui n'est pas pratique. Pour "nommer:tagger" une image déja construite, la commande `sudo docker tag --help` est très informative. Renommez votre image avec le nom "mondebian" et le tag "v1". Le fichier _Dockerfile_ utilise "debian:stable" comme image de base et celle-ci à été téléchargée car celle utilisée précédemment était "debian:latest".

![pas de nom][img2]

Il est aussi possible de choisir le nom et le tag à la construction de l'image. `sudo docker build --help`. Pour donner un nom à l'image il faut utiliser l'option `-t name:tag`. Si on utilise seulement `-t name` le _TAG_ "latest" sera appliqué par défaut.

Créez un nouveau container à partir de votre image "mondebian:v1" et lancez le en mode interactif avec pseudo-terminal. Vérifiez que l'utilitaire _curl_ est bien installé.

![test curl][img3]

Sur le système hôte, modifiez votre fichier _Dockerfile_ avec la commande `nano Dockerfile` afin de pouvoir aussi utiliser les utilitaires _ps_, _[ifconfig][8]_ et _nano_. Vous pouvez utiliser une notation "1.x" si vous construisez des images de test. `sudo docker --help` indique que pour supprimer une image il faut utiliser la commande `rmi`. Nommez votre image finale "mondebian:v2".


### Revenir à l'[exercice 2][1]                  Poursuivre avec l'[exercice 4][2]               

[0]: ./laboDocker.html
[1]: ./laboDocker1.html
[2]:
[3]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
[4]: https://docs.docker.com/engine/reference/builder/#from
[5]: https://hub.docker.com/_/scratch
[6]: https://docs.docker.com/engine/reference/builder/#run
[7]: https://docs.docker.com/storage/storagedriver/#images-and-layers
[8]: https://www.google.com/search?q=install+ifconfig+debian&oq=install+ifconfig+debian

[img0]: ./img/docker/docker3-0.png "persistance dans le meme container"
[img1]: ./img/docker/docker3-1.png "image sans nom:tag"
[img2]: ./img/docker/docker3-2.png "image de base téléchargée"
[img2]: ./img/docker/docker3-3.png "test curl"
