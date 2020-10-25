# Laboratoire sur Docker

## Éxercice 4
Ajouter des fichiers à l'image, monter un répertoire local dans un container, réseau partie 2

### Ajouter des fichiers à une image
Dans l'[éxercice 3][0], nous avons appris que le contenu persiste lorsqu'un container est arrêté. En utilisant un fichier _Dockerfile_ pour construire nos images, nous pouvons exécuter des commandes pour installer des utilitaires. Sur le système hôte, créez un répertoire "dockertest2" et entrez-y puis téléchargez le fichier _Dockerfile_ pour cet éxercice `wget https://raw.githubusercontent.com/matbilodeau/labos-cloud/main/exemples/laboDocker/Dockerfile2`. En vérifiant le contenu, vous remarquerez que deux commandes sont disponibles pour l'ajout de fichiers :

* [COPY][3]
  * Ajoute des fichiers ou répertoires locaux dans le système de fichiers de l'image.
* [ADD][4]
  * Ajoute des fichiers ou répertoires, locaux ou distants, dans le système de fichiers de l'image. Peut décompresser automatiquement les formats d'archivage connus à partir d'une source locale vers un répertoire du système de fichiers de l'image.

Téléchargez le fichier "https://raw.githubusercontent.com/matbilodeau/labos-cloud/main/exemples/laboDocker/index.html" dans le répertoire local afin de pouvoir l'ajouter lors de la construction. Pour créer un nouveau container, nous avons vu la commande `run` qui inclut plusieurs étapes. Exécutons le tout manuellement.

`sudo docker --help` Pour obtenir l'image de base il faut utiliser la commande `pull`. Pour que *Docker* puisse construire l'image, le fichier _Dockerfile_ doit porter exactement ce nom; renommez-le ainsi: `mv Dockerfile2 Dockerfile`. Vous pouvez mainenant construire votre image avec le nom "monhttpd:v1". Pour créer un container, la commande est `create`.  `sudo docker create --help` liste parmi les options `--name`, ce qui permet de choisir le nom du container plutôt que d'utiliser ceux générés automatiquement. Créez un container à partir de "monhttpd:v1" nommé "test1". Démarrez le container, il s'est automatiquement envoyé en arrière plan, puis lancez-y un shell _bash_. Vérifiez que le serveur web est fonctionnel pour les deux fichiers.


La [documentation][4] explique en partie pourquoi le fichier "distant.html" n'est pas [accessible][5]. Lorsque le serveur _Apache_ reçoit des requêtes, elles sont traitées par un _[daemon][6]_. En vérifiant la liste de processus en exécution, _httpd_ est exécuté par le _UID_ "daemon". Pour afficher les informations sur les fichiers, l'utilitaire _exa_ est une amélioration de _ls_. Installez-le et utilisez la commande `exa -lh` pour afficher également les en-têtes de colonnes. Le fichier "distant.html" appartient à l'utilisateur _root_, différent de l'utilisateur _daemon_. Il faut donc ajouter la permission de lecture pour que _daemon_ puisse y accéder, ce que nous ferons avec `chmod +604 distant.html`. Ceci ne règle toutefois pas le problème dans le cas où un nouveau container serait démarré. Il serait possible d'utiliser un _RUN_ dans le _Dockerfile_ avec la command _wget_. Modifiez votre dockerfile et nommez l'image "monhttpd:v2" puis testez de nouveau. L'utilitaire _wget_ télécharge le fichier dans le répertoire courrant. L'instruction _Dockerfile_ _[WORKDIR]_ indique dans quel répertoire exécuter les commandes. Comme nous avons utilisé une image de base [_httpd:2.4_][6], celui-ci correspond à "/usr/local/apache2". Les fichiers .html doivent se trouver dans le répertoire "/usr/local/apache2/htdocs".

![wget dans image][img0]

Bien que fonctionnel, le fichier _Dockerfile_ ne respecte pas les [bonnes pratiques][7]. Modifiez votre fichier _Dockerfile_ pour qu'il puisse, tout en respectant les bonnes pratiques (n'oubliez pas que [_RUN_][8] peut installer plusieurs utilitaires à la fois), afficher correctement "distant.html" et nommez l'image finale "monhttpd:v3".

### Monter un répertoire local dans un container
à venir
### Réseau partie 2
à venir

### Revenir à l'[éxercice 3][1]                  

[0]: ./laboDocker3.html
[1]: ./laboDocker2.html
[3]: https://docs.docker.com/engine/reference/builder/#copy
[4]: https://docs.docker.com/engine/reference/builder/#add
[5]: https://fr.wikipedia.org/wiki/Permissions_UNIX
[6]: https://hub.docker.com/layers/httpd/library/httpd/2.4/images/sha256-548248173d4a6633c730a1ad8030c2f2d7dc86cdff3b6e0f5d44e0e3137afdc9?context=explore
[7]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#add-or-copy
[8]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#run

[img0]: ./img/docker/docker4-0.png "exécuter wget en construisant l'image"
