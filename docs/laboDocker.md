# Laboratoire sur Docker
Si vous n'avez jamais utilisé Docker, ce labo est pour vous. Il est fortement recommandé de faire les éxercices dans l'ordre et de bien exécuter toutes les commandes, surtout celles se terminant avec `--help`. Plusieurs commandes expliquées dans les premiers éxercices ne seront que mentionnées dans les suivants.

Ce laboratoire vous permettra d'installer docker localement, d'interagir avec des images, de créer une image à partir d'un fichier Dockerfile, de tester l'isolation des processus et du système de fichiers, de monter un répertoire local dans un container et de valider l'authenticité des images.

## Installation
À partir d'Ubuntu, armez-vous de votre meilleur copier-coller et exécutez les instructions [ici][0]

Pour la partie _INSTALL DOCKER ENGINE_, seulement les instructions 1 et 3.
Attention, si vous utilisez un autre système d'opération les instructions sont [différentes][1]

## Éxercice 1

### Premier pas
Exécutez `sudo docker --help`

La commande `sudo docker run hello-world` que vous avez testé précédemment sert à exécuter une commande dans un nouveau container.

Exécutez `sudo docker run debian`

Cette commande, `run`, vérifie si l'image est disponible localement et la télécharge au besoin. Un nouveau container est créé puis lancé mais dans ce cas-ci nous n'avons pas vu de signe d'exécution contrairement au hello-world. C'est normal, un container s'arrête lorsqu'il n'y a plus de processus en exécution.

![docker run debian][img0]

Pour vérifier que l'image debian est bien disponible localement, `sudo docker images`. Pour référer une image lors de l'exécution de commandes, on peut utiliser le _IMAGE ID_ ou le _REPOSITORY + TAG_. Comme nous n'avons pas de commande pour l'instant, nous allons exécuter le container en mode interactif avec un pseudo-terminal, ce qui va nous placer *dans* le container.

### Intro système de fichiers
Exécutez `sudo docker run --help`

Les options nécessaires pour le mode interactif et le tty sont -t et -i que nous combinerons ainsi: `sudo docker run -ti debian:latest`. Pour vérifier la version: `cat /etc/*-release`. Explorez le système de fichier : `ls`, `ls /bin` et `ls /sbin`, `ls /usr/bin` et `ls /usr/sbin` contiennent des utilitaires de base pour un contexte Debian. Les autres fichiers présents sont également minimaux, comme dans /etc, /dev et /var. Créez un nouveau fichier `touch /home/test1` puis `ls /home` pour vérifier. Sortez du container avec `exit` puis vérifier le contenu, `ls /home` sur votre système hôte. Avec Docker, les systèmes de fichiers sont isolés: un changement dans le container existe seulement dans le container.

![ls /home][img1]

Exécutez `sudo docker run -ti <IMAGE ID>` avec l'ID associé à debian latest. Allons voir le contenu du répertoire modifié à la dernière étape avec `ls /home`. Le fichier test1 est absent car la commande `run` crée un *nouveau* container à partir de l'image. Nous avons exécuté `run` quatre fois (hello-world, debian, debian:latest, <IMAGE ID>) donc nous avons créé 4 containers en tout. Sortez du container avec `exit`.

Exécutez `sudo docker container`. Pour lister les containers, nous devons utiliser `sudo docker container ls`. Cette commande retourne une liste des containers, vide si vous avez suivi les instructions jusqu'à maintenant. `sudo docker container ls --help` nous informe que la commande ne liste que les containers en exécution par défaut, il faut utiliser l'option `-a` pour avoir la liste complète. Remarquez sous _IMAGE_ la correspondance avec les commandes données à docker run préalablement. Sous _COMMAND_, bien que nous n'ayons rien spécifié lors du run, un shell bash était en cours d'exécution pour le pseudo-terminal.  La colonne _NAMES_ contient un nom généré automatiquement, plus simple à mémoriser que le _CONTAINER ID_.

![docker container ls -a][img2]

Pour enlever un container individuellement, `sudo docker container rm --help`, mais nous enleverons plutôt tous les container arrêtés avec `sudo docker container prune`.

### Poursuivre avec l'[éxercice 2][2]


[0]: https://docs.docker.com/engine/install/ubuntu/
[1]: https://docs.docker.com/engine/install/
[2]: ./laboDocker1.html

[img0]: ./img/docker/docker1-0.png "docker run debian"
[img1]: ./img/docker/docker1-1.png "ls /home"
[img2]: ./img/docker/docker1-2.png "docker container ls -a"
