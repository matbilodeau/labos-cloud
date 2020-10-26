# Laboratoire sur Docker

## Éxercice 5
Fichier _Dockerfile_ exécuter une commande, changer d'utilisateur dans le container.

### Exécuter une commande au lancement du container.
Dans l'[éxercice 4][0], nous avons appris comment monter un répertoire dans un container et comment publier un port pour accéder à un service qui s'exécute dans un container. Créez un répertoire "dockertest3" sur le système hôte puis créez-y un fichier _Dockerfile_ avec les instructions suivantes: à partir d'une image de base "ubuntu:18.04" installez _curl_ _procps_ _nano_ et _apache2_ et exposez le port 80.

* [CMD][3]
  * Indique quelle commande exécuter par défaut au lancement du container.
* [ENTRYPOINT][4]
  * Permet de configurer un container pour simuler un fichier exécutable acceptant des arguments.

Les bonnes pratiques pour l'instruction [CMD][5] contiennent la commande nécessaire au lancement du server web apache. Ajoutez l'instruction à votre Dockerfile. Construisez une image nommée "monapache:v1", créez un container nommé "testcmd" et lancez-le en arrière plan.

![apache cmd][img0]

Puisque notre container exécute seulement _apache2_, c'est presque comme s'il sagissait d'un exécutable indépendant qui sert un site web. Utilisez l'instruction _ENTRYPOINT_ pour votre nouvelle image "monapache:v2" tout en respectant les [bonnes pratiques][6]

Pour trouver à quel endroit se trouvent les fichiers _html_ servis par _apache2_, utilisez la commande `cat /etc/apache2/sites-available/000-default.conf` qui fera afficher le _DocumentRoot_. Montez le répertoire "public-html" au _DocumentRoot_ et testez votre container.

### Utilisateurs
Par défaut, les processus s'exécutent en tant qu'utilisateur _root_ dans le container. Lorsqu'un processus peut fonctionner en mode non-privilégié, l'instruction _[USER][7]_ du fichier _Dockerfile_ permet de changer l'utilisateur qui exécutera les commandes _RUN_, _CMD_ et _ENTRYPOINT_ suivantes dans le fichier.

Pour les besoins de l'éxercice, nous allons sécuriser l'exécution de notre version _debian_. Modifiez le fichier _Dockerfile_ se trouvant dans "dockertest" pour pouvoir lancer un shell _sh_ avec un utilisateur non-privilégié. La commande `useradd -u 6699 -G users -d /home/mathieu mathieu && mkdir /home/mathieu && chown mathieu /home/mathieu` permet d'ajouter un utilisater ayant l'_UID_ 6699, associé au groupe _users_, avec un repertoire personnel "/home/mathieu"; la commande crée ce répertoire puis change le propriétaire de /home/mathieu. Explorez le système de fichiers, montez un répertoire local, testez les commandes. Nommez votre image finale "mondebian:v3".

![utilisateur non-privilégié][img1]

Cette manière de procéder est utile seulement lorsque l'application exécutée dans le container peut fonctionner correctement à partir d'un utilisateur non-privilégié. Pour les applications qui doivent s'exécuter dans le container en tant que _root_, il est recommandé soit de modifier l'application pour qu'elle fonctionne en mode non-privilégié ou d'utiliser le _[user namespace][8]_. Un mode expérimental, _[Rootless mode][9]_ est également disponible pour se prémunir contre les escalades de privilège.

### Revenir à l'[éxercice 4][1]                  Poursuivre avec l'éxercice 6                  

[0]: ./laboDocker3.html
[1]: ./laboDocker2.html
[3]: https://docs.docker.com/engine/reference/builder/#cmd
[4]: https://docs.docker.com/engine/reference/builder/#entrypoint
[5]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#cmd
[6]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#entrypoint
[7]: https://docs.docker.com/engine/reference/builder/#user
[8]: https://docs.docker.com/engine/security/userns-remap/
[9]: https://docs.docker.com/engine/security/rootless/



[img0]: ./img/docker/docker5-0.png "lancer apache avec instruction CMD"
[img1]: ./img/docker/docker5-1.png "utilisateur non-privilégié"
