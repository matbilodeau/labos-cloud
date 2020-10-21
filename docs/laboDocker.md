#Laboratoire sur Docker
Si vous n'avez jamais utilisé Docker, ce labo est pour vous. Il est fortement recommandé de faire les exercices dans l'ordre et de bien exécuter toutes les commandes, surtout celles se terminant avec `--help`. Plusieurs commandes expliquées dans les premiers exercices ne seront que mentionnées dans les suivants.

Ce laboratoire vous permettra d'installer docker localement, d'interagir avec des images, de créer une image à partir d'un fichier Dockerfile, de tester l'isolation des processus et du système de fichiers, de monter un répertoire local dans un container et de valider l'authenticité des images.

##Installation
À partir d'Ubuntu, armez-vous de votre meilleur copier-coller et exécutez les instructions [suivantes][0] :

Pour la partie _INSTALL DOCKER ENGINE_, seulement les instructions 1 et 3.
Attention, si vous utilisez un autre système d'opération les instructions sont [différentes][1]

##Exercice 1

### Premier pas
Exécutez `sudo docker --help`

La commande `sudo docker run hello-world` que vous avez testé précédemment sert à exécuter une commande dans un nouveau container.

Exécutez `sudo docker run debian`

Cette commande, `run`, vérifie si l'image est disponible localement et la télécharge au besoin. Un nouveau container est créé puis lancé mais dans ce cas-ci nous n'avons pas vu de signe d'exécution contrairement au hello-world. C'est normal, un container s'arrête lorsqu'il n'y a plus de processus en exécution.

Pour vérifier que l'image debian est bien disponible localement, `sudo docker images`. Pour référer une image lors de l'exécution de commandes, on peut utiliser le _IMAGE ID_ ou le _REPOSITORY + TAG_. Comme nous n'avons pas de commande pour l'instant, nous allons exécuter le container en mode interactif avec un pseudo-terminal, ce qui va nous placer *dans* le container.

### Intro système de fichiers
Exécutez `sudo docker run --help`

Les options nécessaires pour le mode interactif et le tty sont -t et -i que nous combinerons ainsi: `sudo docker run -ti debian:latest`. Pour vérifier la version: `cat /etc/*-release`. Explorez le système de fichier : `ls`, `ls /bin` et `ls /sbin`, `ls /usr/bin` et `ls /usr/sbin` contiennent des aplications de base pour un contexte Debian. Les autres fichiers présents sont également minimaux, comme dans /etc, /dev et /var. Créez un nouveau fichier `touch /home/test1` puis `ls /home` pour vérifier. Sortez du container `exit` puis vérifier le contenu, `ls /home` sur votre système hôte. Avec Docker, les systèmes de fichiers sont isolés: un changement dans le container existe seulement dans le container.

Exécutez `sudo docker run -ti <IMAGE ID>` avec l'ID associé à debian latest. Allons voir le contenu du répertoire modifié à la dernière étape avec `ls /home`. Le fichier test1 est absent car la commande `run` crée un *nouveau* container à partir de l'image. Nous avons exécuté `run` quatre fois (hello-world, debian, debian:latest, <IMAGE ID>) donc nous avons créé 4 containers en tout. Sortez du container avec `exit`.

Exécutez `sudo docker container`. Pour lister les containers, nous devons utiliser `sudo docker container ls`. Cette commande retourne une liste des containers, vide si vous avez suivi les instructions jusqu'à maintenant. `sudo docker container ls --help` nous informe que la commande ne liste que les containers en exécution par défaut, il faut utiliser l'option `-a` pour avoir la liste complète. Remarquez sous _IMAGE_ la correspondance avec les commandes données à docker run préalablement. Sous _COMMAND_, bien que nous n'ayons rien spécifié lors du run, un shell bash était en cours d'exécution pour le pseudo-terminal.  La colonne _NAMES_ contient un nom généré automatiquement, plus simple à mémoriser que le _CONTAINER ID_. Pour enlever un container individuellement, `sudo docker container rm --help`, mais nous enleverons plutôt tous les container arrêtés avec `sudo docker container prune`.

##Execrice 2
###Pré-requis
Pour cet exercice, vous aurez besoin d'un second terminal connecté au même hôte. Sur GCP vous pouvez [utiliser][2] la Console et l'outil ligne de commande gcloud sdk.


###Apache
Exécutez `sudo docker run httpd` sur le premier terminal.
_httpd_ est l'image officielle du serveur web Apache. Le container lancé attend les connexions.

###Introduction au réseau des containers
À partir du second terminal, `sudo docker ps --help` la commande `ps` liste également les containers, par défaut en cours d'exécution. Nous avons maintenant _80/tcp_ sous la colonne _PORTS_ et nous y reviendrons plus tard. `curl localhost` retourne un message d'erreur, la connexion est refusée sur le port 80... du système hôte. Pour tester la connexion au container, nous avons besoin de son adresse ip mais `ps` et `container ls` ne l'affichent pas.

Exécutez `sudo docker container --help`

Pour obtenir de l'information détaillée sur un container, il faut utiliser `sudo docker container inspect <container name ou ID>`. Pour obtenir directement l'adresse IP `sudo docker container inspect <container name ou id> | grep IPAddress`. Maintenant un `curl <adresse container httpd>` devrait fonctionner. Sur le terminal 1, vous pouvez voir les logs du serveur web. Comme le terminal 2 est sur le système hôte, l'adresse IP dans les log est celle du gateway Docker. Les logs du container sont disponibles avec `sudo docker container logs <nom ou ID du container>` Toujours à partir du 2e terminal, `sudo docker run -ti debian:latest` puis `curl <ip du container httpd>`. L'outil _curl_ n'étant pas installé dû au système de fichier minimal, les `apt-get update` et `apt-get install curl -y` sont nécessaires. Sur le terminal 1, vous pouvez voir l'adresse ip du container Debian que nous venons d'utiliser.

###Visibilité des processus entre le système hôte et les containers
Sur le terminal 2, `ps -ef` pour avoir une liste des processus en exécution sur le système hôte. La première colonne est le nom d'utilisateur ayant démarré le processus, la 2e colonne le numéro du processus, la 3e le numéro du processus parent, et la dernière la commande exécutée. Vous devriez voir 4 processus httpd. En remontant la hiérarchie des processus parents, vous pouvez remonter à votre utilisateur dans son shell (bash) qui a lancé la commande `sudo docker run...` et au runtime containerd qui exécute le container lui-même.

Pour se connecter à un container en cours d'exécution, il faut lancer un shell dans le container. `sudo docker --help` contient surement un outil.

La commande `sudo docker exec` est exactement pour ça, lancer une commande dans un container en exécution.
`sudo docker exec --help` nous donne également les options `-t` et `-i`, comme dans le cas de `run`, et nous pouvons lancer un shell bash ainsi : `sudo docker exec -ti <container> /bin/bash`. La commande `ps -ef`n'est pas disponible dans ce container car l'image est faite pour servir des pages web et inspecter le statut des processus n'est pas utile. Poul les fins de ce labo `apt-get install procps` installera l'utilitaire dont nous avons besoin. Comparez la liste à l'intérieur du container avec celle obtenue précédemment, prenez note que "/bin/bash" et "ps -ef" sont le shell que vous exécutez dans le container et la commande lancée pour avoir la liste des processus; votre container apache ne roule que les 4 processus httpd et ne voit pas les processus en exécution sur le système hôte.

###Visibilité de processus entre les container
`exit` pour sortir du container, `sudo docker ps` pour confirmer que le httpd est toujours en exécution. Bloquer un terminal pour chaque exécution de container n'est pas vraiment pratique, heureusement `sudo docker run --help` nous indique que l'option `-d` permet d'exécuter le container en arrière plan, donc vous laisser le contrôle du terminal 2. `sudo docker run -tid debian` et vérifiez les containers en exécution. Examinez les processus avec `ps -ef` Vous devriez voir les processus du container httpd et le shell bash du container Debian. Exécutez un shell "sh" dans le container Debian avec `sudo docker exec -ti <container debian> /bin/sh` puis inspectez les processus en cours d'exécution dans le container. Vous verrez seulement le shell bash, votre shell sh et la commande "ps -ef". Sortez avec `exit`.

###Arrêter un container
Un container s'arrête par défaut quand il n'y a plus de processus en cours d'exécution. Pour arrêter un container avec des processus toujours en cours d'exécution nous pouvons utiliser "Ctrl+c" à partir du terminal 1 ou, sur le terminal 2, `exit` pour sortir du container Debian puis `sudo docker stop <nom ou id container httpd>` ou encore `sudo docker kill <nom ou id container httpd>`. `stop` tente de faire un _graceful shutdown_, un arrêt "poli". `kill` impose l'arrêt.


##Exercice 3
Pour créer un nouveau container, nous avons vu la commande `run` qui inclut plusieurs étapes. Exécutons le tout manuellement.
Nous allons télécharger une image, créer un container puis lancer le container. Toujours à partir du terminal 2, le terminal 1 étant occupé avec le container httpd.
`sudo docker --help`
Nous aurons donc besoin de `pull` `create` et `start`. Commencons avec `sudo docker pull archlinux`.








[0]: https://docs.docker.com/engine/install/ubuntu/
[1]: https://docs.docker.com/engine/install/
[2]: https://cloud.google.com/compute/docs/instances/connecting-to-instance#gcetools
