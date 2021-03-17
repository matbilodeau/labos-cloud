## Exercice 3

### Microservices
Dans les exercices [1][0] et [2][1], l'application utilisée était un serveur web [monolithique][3]. Les fonctionnalités de **Kubernetes** permettent de déployer une application selon l'architecture [microservices][4]. L'application pour cet exercice est très simple, un serveur accepte la requête, ajoute son nom, le temps de traitement et un _UPSTREAM URI_ puis la transfère à un autre. Nous utiliserons cette applicaton car elle est facilement enchaînable pour créer plusieurs microservices. Le dernier serveur de la chaîne envoie une requête vers l'externe.

### Mise en place
Assurez vous d'être dans votre répertoire "home/user" avec `cd ~` et clonez le repo https://github.com/matbilodeau/labos-cloud. Déplacez le répertoire de l'exercice vers votre répertoire "kubetest" `mv labos-cloud/exemples/laboKube/microservice1/ kubetest` puis entrez-y `cd /kubetest/microservice1` et explorez le contenu. Le répertoire "image" contient le [fichier _Dockerfile_][5] et l'application ("index.js" et "package.json"). Ce répertoire est séparé dans un sous-dossier pour ne pas être pris en compte par la commande `kubectl apply -f .` où le "." réfère au répertoire courant sans les sous-dossiers. Les fichiers _[manifests][1]_ de base sont fournis pour créer un déploiement et un service. Ici on regroupe les déploiements ensemble et les services ensemble; les [bonnes pratiques][6] mentionnent simplement de regrouper les ressources ayant un lien commun. Ici elles sont liées selon leur type. Modifiez le fichier "deployments.yaml" pour avoir 3 déploiements: un frontend-prod, un middleware-prod et un backend-prod. Le _UPSTREAM_URI_ défini où faire suivre la requête; utilisez le motif suivant:  frontend -> middleware -> backend -> http://worldclockapi.com/api/json/utc/now . Kubernetes crée automatiquement des entrées _[DNS][7]_ pour les services, on peut donc appeler les services directement par leur nom (ex. "middleware"). Modifiez le fichier "services.yaml" pour avoir 3 services soit frontend, middleware, backend. Laissez les dernières lignes du fichier en commentaire telles quelles (débutent avec un _#_).

### Construction de l'image et déploiement
Construisez l'image à partir du _Dockerfile_ avec un nom:tag approprié pour votre repo et publiez-là. N'oubliez pas de modifier le _manifest_ en conséquence sinon votre déploiement utilisera l'image pré-construite [disponible publiquement][8]. [Créez][9] votre cluster en spécifiant le type de machine "n1-standard-1", 4 nodes, un [addon][10] pour le [HttpLoadBalancing][11] , "autoupgrade" et "autorepair" activés. Appliquez les modifications contenues dans les _manifests_ du répertoire courant. Si vous préférez créer spécifiquement le contenu d'un _manifest_, utilisez `kubectl create -f chemin/fichier.yaml` et `kubectl delete -f chemin/fichier.yaml` pour supprimer. Vérifiez que vous avez bien les 3 pods et les 3 services.

### Services réseau
Pour communiquer avec le cluster, nous avons besoin d'une porte d'entrée. Les exercices précédents utilisaient un _[Ingress][12]_ mais ce service ne peut pas diriger de trafic vers les services de type _[ClusterIP][13]_. Le service de type _[LoadBalancer][14]_ pourra diriger le trafic vers un service de type _ClusterIP_, ce dernier permet aux _pods_ de communiquer entre eux. Les instructions pour créer le _LoadBalancer_ sont en commentaire (_#_) dans le fichier "services.yaml" et vous n'avez qu'a retirer le _#_ et ajouter les bonnes valeurs selon le modèle dans la documentation; aucune autre valeur que celles fournies n'est nécessaire pour faire fonctionner l'application. Vous pouvez utiliser `kubectl apply -f chemin/fichier.yaml` pour mettre à jour les ressources. Le résultat final devrait ressembler à l'image ci-dessous.

![microservices][img0]

Vous pouvez supprimer votre cluster quand vous aurez terminé.


### Revenir à l'[exercice 2][1]                  Poursuivre avec l'[exercice 4][2]

[0]: ./laboKube0.html
[1]: ./laboKube1.html
[2]: ./laboKube3.html

[3]: https://fr.wikipedia.org/wiki/Application_monolithe
[4]: https://fr.wikipedia.org/wiki/Microservices
[5]: ./laboDocker2.html
[6]: https://kubernetes.io/docs/concepts/configuration/overview/
[7]: https://kubernetes.io/fr/docs/concepts/services-networking/dns-pod-service/
[8]: https://hub.docker.com/repository/docker/matbilodeau/microservice1
[9]: https://cloud.google.com/sdk/gcloud/reference/container/clusters/create
[10]: https://cloud.google.com/sdk/gcloud/reference/container/clusters/create#--addons
[11]: https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters#Cluster.AddonsConfig
[12]: https://kubernetes.io/fr/docs/concepts/services-networking/ingress/
[13]: https://kubernetes.io/fr/docs/concepts/services-networking/service/#publishing-services-service-types
[14]: https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer


[img0]: ./img/kube/kube3-0.png "microservices"
