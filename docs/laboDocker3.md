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

`sudo docker --help` Pour obtenir l'image de base il faut utiliser la commande `pull`. Pour que *Docker* puisse construire l'image, le fichier _Dockerfile_ doit porter exactement ce nom; renommez-le ainsi: `mv Dockerfile2 Dockerfile`. Vous pouvez mainenant construire votre image avec le nom "monhttpd:v1". Pour créer un container, la commande est `create`.  `sudo docker create --help` liste parmi les options `--name`, ce qui permet de choisir le nom du container plutôt que d'utiliser ceux générés automatiquement. Créez un container à partir de "monhttpd:v1" nommé "test1". Démarrez le container, il s'est automatiquement envoyé en arrière plan, puis lancez-y un shell _bash_. Vérifiez que le serveur web est fonctionnel pour les deux fichiers avec `curl localhost` et `curl localhost/distant.html`.


La [documentation][4] explique en partie pourquoi le fichier "distant.html" n'est pas [accessible][5]. Lorsque le serveur _Apache_ reçoit des requêtes, elles sont traitées par un _[daemon][6]_. En vérifiant la liste de processus en exécution, _httpd_ est exécuté par le _UID_ "daemon". Pour afficher les informations sur les fichiers, l'utilitaire _exa_ est une amélioration de _ls_. Installez-le et utilisez la commande `exa -lh` pour afficher également les en-têtes de colonnes. Le fichier "distant.html" appartient à l'utilisateur _root_, différent de l'utilisateur _daemon_. Il faut donc ajouter la permission de lecture pour que _daemon_ puisse y accéder, ce que nous ferons avec `chmod +604 distant.html`. Ceci ne règle toutefois pas le problème dans le cas où un nouveau container serait démarré. Il serait possible d'utiliser un _RUN_ dans le _Dockerfile_ avec la command _wget_. Modifiez votre dockerfile et nommez l'image "monhttpd:v2" puis testez de nouveau. L'utilitaire _wget_ télécharge le fichier dans le répertoire courrant. L'instruction _Dockerfile_ _[WORKDIR][6]_ indique dans quel répertoire exécuter les commandes. Comme nous avons utilisé une image de base [_httpd:2.4_][7], celui-ci correspond à "/usr/local/apache2". Les fichiers .html doivent se trouver dans le répertoire "/usr/local/apache2/htdocs".

![wget dans image][img0]

Bien que fonctionnel, le fichier _Dockerfile_ ne respecte pas les [bonnes pratiques][8]. Des [instructions][9] sont disponibles pour l'utilisation de l'image de base _httpd_. Modifiez votre fichier _Dockerfile_ pour qu'il puisse, tout en respectant les bonnes pratiques, afficher correctement "distant.html" et nommez l'image finale "monhttpd:v3".

### Monter un répertoire local dans un container
La manière [recommandée][10] pour persister de l'information entre les containers et le système hôte est le [volume][11]. Dans votre répertoire "dockertest2", créez un répertoire "public-html" puis copiez-y le fichier "index.html" téléchargé préalablement avec `mkdir public-html && cp index.html public-html/`. Modifiez le fichier avec un texte personnalisé. Créez une copie de ce fichier nommée "fichier2.html" et modifiez aussi le texte. Pour les besoins de cet éxercice, nous utiliserons un _[bind mount][12]_ pour la simplicité. L'option `-v chemin/sur/hôte/:chemin/dans/image/` peut être utilisée avec `run` ou `create`; pour des raisons de sécurité, *Docker* ne permet pas de monter un répertoire dans un container déjà créé. Créez un nouveau container à partir de votre image "monhttpd:v3" et montez "/home/<votre utilisateur>/dockertest2/public-html" vers "/usr/local/apache2/htdocs/", exécutez-le en arrière-plan puis lancez un shell _bash_ à l'intérieur. Inspectez le contenu du répertoire "htdocs" dans le container. Créez un nouveau fichier nommé "fichier3.html". Sortez du container et inspectez le contenu du répertoire "public-html" sur le système hôte.

![repertoire monté][img1]
Les fichiers montés appartiennent à l'utilisateur 1001, ce qui correspond à mon utilisateur sur le système hôte.

![utilisateurs locaux][img2]

Le "fichier3.html" appartient à l'utilisateur _root_ sur mon système hôte; c'est _root_ qui a démarré le processus du container et qui écrit le fichier localement. Nous verrons comment changer d'utilisateur dans le container plus tard.

### Réseau partie 2
Nos interactions avec le réseau ont été minimales, lorsque nous avons testé la connection au serveur web nous sommes restés sur _localhost_. La colonne _PORTS_ affichée par `sudo docker images` indique le port 80/tcp, on dit que le port 80 est donc exposé. Ceci est possible avec l'instruction _[EXPOSE][13]_ du fichier _Dockerfile_. Les [bonnes pratiques][14] indique effectivement d'utiliser les ports traditionnels. L'instruction _EXPOSE_ ne fait qu'indiquer sur quel port le container s'attend à recevoir du trafic. Dans notre cas, le _Dockerfile_ de notre image de base _[httpd][15]_ indique bien _EXPOSE 80_ à la ligne 228.

Dans l'[éxercie2][16], nous avons testé la communication entre deux containers sur un même réseau. Le _[default bridge network][17]_ a été utilisé pour tous nos containers jusqu'à maintenant. Sur ce réseau, les containers peuvent communiquer entre-eux à partir de leur adresse IP. Pour les besoins de l'éxercice ceci sera suffisant, mais devoir se fier à des adresses est peu pratique si on considère que les containers doivent être le plus [éphémères][18] possible. Les réseaux de type _[user-defined][19]_ ont plusieurs avantages comme la résolution automatique DNS et une meilleure isolation.

Pour pouvoir lier le port exposé au système hôte, la [documentation][13] indique qu'il faut publier le port. De manière semblable au _bind mount_, publier un port doit se faire à la création du container. Avec l'option `-P`, tous les ports exposés seront publiés vers un port aléatoire du système hôte.

![option -P][img3]

Pour publier individuellement les ports, il faut utiliser l'option `-p port_container` qui publiera "port_container" sur un port aléatoire du système hôte. Nous pouvons spécifier le port du système hôte avec `- p port_hôte:port_container`.

![port spécifique][img4]

Si votre système hôte peut être accessible publiquement par internet, assurez-vous que les règles de votre pare-feu sont bien configurées et votre container sera accessible sur le port publié.

### Revenir à l'[éxercice 3][1]                  Poursuivre avec l'[éxercice 5][2]

[0]: ./laboDocker2.html
[1]: ./laboDocker2.html
[2]: ./laboDocker4.html
[3]: https://docs.docker.com/engine/reference/builder/#copy
[4]: https://docs.docker.com/engine/reference/builder/#add
[5]: https://fr.wikipedia.org/wiki/Permissions_UNIX
[6]: https://docs.docker.com/engine/reference/builder/#workdir
[7]: https://hub.docker.com/layers/httpd/library/httpd/2.4/images/sha256-548248173d4a6633c730a1ad8030c2f2d7dc86cdff3b6e0f5d44e0e3137afdc9?context=explore
[8]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#add-or-copy
[9]: https://hub.docker.com/_/httpd?tab=description
[10]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#volume
[11]: https://docs.docker.com/storage/volumes/
[12]: https://docs.docker.com/storage/bind-mounts/
[13]: https://docs.docker.com/engine/reference/builder/#expose
[14]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#expose
[15]: https://github.com/docker-library/httpd/blob/077141ee37fca63972292c562ec0f632d0f831b1/2.4/Dockerfile
[16]: ./laboDocker1.html
[17]: https://docs.docker.com/network/bridge/#use-the-default-bridge-network
[18]: https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#create-ephemeral-containers
[19]: https://docs.docker.com/network/bridge/#differences-between-user-defined-bridges-and-the-default-bridge


[img0]: ./img/docker/docker4-0.png "exécuter wget en construisant l'image"
[img1]: ./img/docker/docker4-1.png "liste des fichiers montés"
[img2]: ./img/docker/docker4-2.png "vue du système hôte"
[img3]: ./img/docker/docker4-3.png "avec option -P"
[img4]: ./img/docker/docker4-4.png "publier un port spécifique"
