# Laboratoire sur Docker

## Éxercice 6
Authentifier une image **Docker**, utilisation d'un régistre.

### Pré-requis
Pour cet éxercice, le compte **Docker Hub** est facultatif mais utile si vous voulez tester vous même la publication d'une image.

### Authentifier l'image que nous construisons
Lorsqu'on construit une image, **Docker** fourni un _IMAGE ID_ qui peut sembler aléatoire. C'est en fait les 12 premiers caractères du hash _sha-256_ pour celle-ci. Créez un nouveau répertoire nommé "dockertest4", Téléchargez le fichier https://raw.githubusercontent.com/matbilodeau/labos-cloud/main/exemples/laboDocker/Dockerfile3 et construisez l'image "utilisateurdockerhub/monhttpd:v4". La commande `sudo docker image inspect` permet d'obtenir les métadonnées détailées de l'image. Les _sha-256_ correspondent à ceux générés pour chaque image [intermédiaire][2] construite lors de **votre** build; des containers temporaires sont créés et vous pouvez aussi voir le _Id_ du dernier container temporaire. Vous pouvez inspecter l'image de base utilisée par l'instruction _FROM_ et comparer les hash et authentifier celle-ci. La valeur _HTTPD_SHA256_ n'est pas calculée, elle provient d'une variable d'environnement configurée dans le fichier _[Dockerfile][3]_ de l'image de base. Une recherche internet permet de vérifier que cela correspond effectivement au fichier compressé "httpd-2.4.46.tar.bz2". `sudo docker history` indique l'historique de construction de l'image; chaque image correspond à une instruction du fichier _Dockerfile_. Les images manquantes correspondent aux couches inférieures de l'image de base, des images intermédiaires, qui ont été inclues dans un seul et unique bloc en lecture seule. En utilisant le même fichier _Dockerfile_ à partir d'un système différent, les images intermédiaires auront des _sha-256_ différents et les couches construites aussi. Vous pouvez ainsi valider que l'image a bien été construite selon les instructions figurant au fichier _Dockerfile_ lors de **votre** _build_. Le bloc de couches identiques correspond aux couches de l'image de base "httpd:2.4".

![1000 mots][img0]

### Authentifier l'image que nous téléchargeons d'un régistre
Un [régistre][4] est une application permettant de stocker et distribuer des images **Docker** qui peut s'exécuter localement. **[Docker Hub][5]** est le service officiel de **Docker** pour héberger des _[repositories][6]_ contenant des images, publiques ou privées. Si vous avez un compte, vous pouvez utiliser la commande `sudo docker login` puis `sudo docker push` pour publier une image que vous avez construite; _login_ permet aussi de télécharger les images privées auxquelles vous avez accès. L'image envoyée vers **Docker Hub** est celle **que vous avez construite**, elle n'est pas reconstruite sur un système distant, ce qui signifie que les _sha-256_ des images intermédiaires et des couches correspondront. Les couches sont publiées de la plus haute à la plus basse et téléchargées de la plus basse à la plus haute. Un _sha-256_ est ajouté par le régistre pour valider l'opération de stockage distant. Si vous téléchargez l'image à partir d'un autre système, vous pouvez comparer les valeurs et valider que l'image téléchargée correspond à celle [publiée][8].

![push pull][img1]

### Revenir à l'[éxercice 5][1]                 


[1]: ./laboDocker4.html
[2]: https://docs.docker.com/storage/storagedriver/#images-and-layers
[3]: https://github.com/docker-library/httpd/blob/077141ee37fca63972292c562ec0f632d0f831b1/2.4/Dockerfile
[4]: https://docs.docker.com/registry/
[5]: https://docs.docker.com/docker-hub/
[6]: https://docs.docker.com/docker-hub/repos/
[7]: https://downloads.apache.org/httpd/httpd-2.4.46.tar.bz2.sha256
[8]: https://hub.docker.com/layers/matbilodeau/monhttpd/v4/images/sha256-7c4d9f3bd1329b477aeac492d2b7462f209f65bc94594a150d8dcf1a24a56f60

[img0]: ./img/docker/docker6-0.png "comparaison des hash sha-256"
[img1]: ./img/docker/docker6-1.png "inspection push et pull"
