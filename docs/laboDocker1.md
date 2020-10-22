# Laboratoire sur Docker

## Exercice 2
### Pré-requis
Pour cet exercice, vous aurez besoin d'un second terminal connecté au même hôte. Sur GCP vous pouvez [utiliser][0] la Console et l'outil ligne de commande gcloud sdk.


### Apache
Exécutez `sudo docker run httpd` sur le premier terminal.
_httpd_ est l'image officielle du serveur web Apache. Le container lancé attend les connexions.

### Introduction au réseau des containers
À partir du second terminal, `sudo docker ps --help` la commande liste également les containers, par défaut en cours d'exécution. `sudo docker ps` Nous avons maintenant _80/tcp_ sous la colonne _PORTS_ et nous y reviendrons plus tard. `curl localhost` retourne un message d'erreur, la connexion est refusée sur le port 80... du système hôte. Pour tester la connexion au container, nous avons besoin de son adresse ip mais `ps` et `container ls` ne l'affichent pas.

Exécutez `sudo docker container --help`

Pour obtenir de l'information détaillée sur un container, il faut utiliser `sudo docker container inspect <container name ou ID>`. Pour obtenir directement l'adresse IP `sudo docker container inspect <container name ou id> | grep IPAddress`. Maintenant un `curl <adresse container httpd>` devrait fonctionner. Sur le terminal 1, vous pouvez voir les logs du serveur web. Comme le terminal 2 est sur le système hôte, l'adresse IP dans les log est celle du gateway Docker. Les logs du container sont disponibles avec `sudo docker container logs <nom ou ID du container>` Toujours à partir du 2e terminal, `sudo docker run -ti debian:latest` puis `curl <ip du container httpd>`. L'outil _curl_ n'étant pas installé dû au système de fichier minimal, les `apt-get update` et `apt-get install curl -y` sont nécessaires. Sur le terminal 1, vous pouvez voir l'adresse ip du container Debian que nous venons d'utiliser. Sur le terminal 2, sortez avec `exit`.

![curl et logs][img0]

### Visibilité des processus entre le système hôte et les containers
Sur le terminal 2, `ps -ef` pour avoir une liste des processus en exécution sur le système hôte. La première colonne est le nom d'utilisateur ayant démarré le processus, la 2e colonne le numéro du processus (_PID_), la 3e le numéro du processus parent(_PPID_), et la dernière la commande exécutée. Vous devriez voir 4 processus httpd. En remontant la hiérarchie des processus parents, vous arriverez à votre utilisateur dans son shell (bash) qui a lancé la commande `sudo docker run...` et au runtime containerd qui exécute le container lui-même. Vous pouvez utiliser la commande `pstree <PID>` avec le _PID_ de votre terminal et du containerd. Le système hôte peut voir les processus à l'intérieur des containers.

![ps -ef][img1]
![pstree][img2]

Nous allons maintenant nous connecter au container _httpd_. Pour se connecter à un container en cours d'exécution, il faut lancer un shell dans le container. `sudo docker --help` contient sûrement un outil.

La commande `sudo docker exec` est exactement pour ça, lancer une commande dans un container en exécution.
`sudo docker exec --help` nous donne également les options `-t` et `-i`, comme dans le cas de `run`, et nous pouvons lancer un shell bash dans le container _httpd_ ainsi : `sudo docker exec -ti <container> /bin/bash`. La commande `ps -ef` n'est pas disponible dans ce container car l'image est faite pour servir des pages web et inspecter le statut des processus n'est pas utile. Poul les fins de ce labo `apt-get install procps` installera l'utilitaire dont nous avons besoin. Comparez la liste à l'intérieur du container avec celle obtenue précédemment, prenez note que "/bin/bash" et "ps -ef" sont le shell que vous exécutez dans le container et la commande lancée pour avoir la liste des processus; votre container _httpd_ n'exécute que les 4 processus httpd, quand on ne s'y connecte pas pour pour faire des tests, et ne voit pas les processus en exécution sur le système hôte.

![ps -ef container][img3]

### Visibilité de processus entre les container
`exit` pour sortir du container, `sudo docker ps` pour confirmer que le httpd est toujours en exécution. Bloquer un terminal pour chaque exécution de container n'est pas vraiment pratique, heureusement `sudo docker run --help` nous indique que l'option `-d` permet d'exécuter le container en arrière plan, donc vous laisser le contrôle du terminal 2. `sudo docker run -d debian` et vérifiez les containers en exécution. Si vous ne voyez pas de container _Debian_ c'est normal, aucun processus n'a été lancé. Corrigeons en utilisant le mode interactif + pseudo-terminal + arrière plan `-tid`. Examinez les processus avec `ps -ef` sur le système hôte. Vous devriez voir les processus du container _httpd_ et le shell _bash_ créé au lancement du container _Debian_ (run -ti) et le shell _sh_ (exec .. /bin/sh).

![ps -ef plusieurs container][img4]

Exécutez un shell "sh" dans le container _Debian_ avec `sudo docker exec -ti <container debian> /bin/sh` puis inspectez les processus en cours d'exécution dans le container. Vous verrez seulement le shell _bash_, votre shell _sh_ et la commande _ps -ef_.  Sortez avec `exit`.

### Arrêter un container
Un container s'arrête par défaut quand il n'y a plus de processus en cours d'exécution. Pour arrêter un container avec des processus toujours en cours d'exécution nous pouvons utiliser "Ctrl+c" à partir du terminal 1 ou, sur le terminal 2, `exit` pour sortir du container Debian puis `sudo docker stop <nom ou id container httpd>` ou encore `sudo docker kill <nom ou id container httpd>`. `stop` tente de faire un _graceful shutdown_, un arrêt "poli" tandis que `kill` impose l'arrêt. Enlevez tous les container arrêtés.

### Revenir à l'[exercice 2][2]

[0]: https://cloud.google.com/compute/docs/instances/connecting-to-instance#gcetools
[1]: ./laboDocker.html
[2]: ./laboDocker2.html

[img0]: ./img/docker/docker2-0.png "curl et logs"
[img1]: ./img/docker/docker2-1.png "ps -ef"
[img2]: ./img/docker/docker2-2.png "pstree"
[img3]: ./img/docker/docker2-3.png "isolation des processus dans le container"
[img4]: ./img/docker/docker2-4.png "ps -ef plusieurs containers"
