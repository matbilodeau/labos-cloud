## Exercice 1

### Création d'un cluster
Exécutez `gcloud config list` puis `kubectl version` pour vérifier que vous êtes connectés au bon projet et que les utilitaires sont bien [installés][0].

Connectez vous à l'interface graphique de la console de **GCP** pour **[Kubernetes Engine][3]**, activez l'_API_ au besoin, et explorez les options s'offrant à vous, notamment pour la création de cluster et les valeurs par défaut. Pour ce laboratoire nous privilégierons l'utilitaire _gcloud sdk_. `gcloud container clusters --help` Pour [créer un cluster][4] **Kubernetes** utilisez la commande `gcloud container clusters create test-kubernetes`. Ce cluster sera créé avec les paramètres par défaut tels qu'affichés dans l'interface graphique.

![GKE gui][img0]

 _Kubectl_ est un utilitaire permettant d'interagir avec le [plan de contrôle][5] Kubernetes via la composante _kube-apiserver_. Exécutez `kubectl --help`. Pour obtenir des informations sur le cluster créé exécutez `kubectl cluster-info`.

![kubectl error][img1]

En effet, nous n'avons pas spécifié à quel cluster connecter _kubectl_. Il se peut toutefois que la commande ait fonctionné implicitement en utilisant une forme d'authentification basique. Référez-vous au message d'avertissement généré lors de la création du cluster. La [commande][6] en question permet également de changer le cluster auquel nous sommes connectés. `kubectl get nodes` affiche les [noeuds][9] du cluster.

![cluster warning][img2]

### Mise en place d'une application
Créez et entrez dans le répertoire "kubetest" puis clonez le repo **GitHub** suivant: "https://github.com/matbilodeau/test-apache-kube". La commande est `git clone https://github.com/matbilodeau/test-apache-kube`. Entrez dans ce répertoire et explorez le contenu.

### Pour créer votre propre image
Construisez l'image à partir du fichier _Dockerfile_ fourni avec un nom:tag conforme pour la publication vers votre [repo][7] puis publiez-la. Modifiez le fichier "apache-deployment.yaml" en conséquence. Continuez avec les instructions ci-dessous.

### Pour utiliser une image publique
Kubernetes prend ses instructions sous forme de fichiers ".yaml".  Pour appliquer les modifications selon les fichiers fournis ([pods][8], [deployment][9], [services][10], [ingress][11]), il faut utiliser `kubectl apply -f .` ce qui créera toutes les ressources décrites dans les fichiers ".yaml". `kubectl get --help` La commande sert à afficher des informations sur différents types de ressources; affichez les ressources crées avec `kubectl get pods`, `kubectl get services` et `kubectl get deployments`. L'utilitaire _watch_ permet de répéter une commande et d'afficher le résultat, ce qui peut être très pratique pour surveiller la création de vos ressources, par exemple avec `watch kubectl get ingress`.

Prenez note qu'il peut y avoir un certain délai avant que la page web ne soit disponible. Le fichier index.html propose d'afficher le _hostname_ mais il s'agit ici de la partie _hostname_ de l'_url_. Le fichier "index2.html" affiche ce qui ressemble à un _CONTAINER ID_, celui du container intermédiaire lors de la construction de l'image.

![container intermédiaire][img3]

Si vous avez construit vous même votre image, enlevez le _#_ devant _echo_ dans le fichier "entrypoint.sh" puis reconstruisez l'image, par exemple avec un tag "v2". Modifiez le fichier "apache-deployment.yaml" pour utiliser "matbilodeau/test-apache-kube:v2" ou la vôtre. Rechargez le fichier "index2.html". Vous avez maintenant l'information du pod qui a répondu à la requête _http_.

![pod][img4]

L'explication de la différence entre les deux affichages se trouve dans les instructions de [_RUN_][10] et [_ENTRYPOINT_][11], plus particulièrement le moment où ils s'exécutent.

Pour tout supprimer, utilisez directement `gcloud container clusters delete test-kubernetes`. Le même déploiement est utilisé pour l'exercice 2

### Poursuivre avec l'exercice 2 (à venir)


[0]: ./laboKube.html


[3]: https://console.cloud.google.com/kubernetes
[4]: https://cloud.google.com/sdk/gcloud/reference/container/clusters/create
[5]: https://kubernetes.io/fr/docs/concepts/overview/components/#composants-master
[6]: https://cloud.google.com/sdk/gcloud/reference/container/clusters/get-credentials
[7]: https://docs.docker.com/docker-hub/repos/

[8]: https://kubernetes.io/fr/docs/concepts/workloads/pods/pod/
[9]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[10]: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types
[11]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[9]: https://kubernetes.io/fr/docs/concepts/architecture/nodes/
[10]: ./laboDocker2.html
[11]: ./laboDocker4.html

[img0]: ./img/kube/kube1-0.png "GCP GUI"
[img1]: ./img/kube/kube1-1.png "erreur de connection"
[img2]: ./img/kube/kube1-2.png "avertissement cluster"
[img3]: ./img/kube/kube1-3.png "image intermédiaire"
[img4]: ./img/kube/kube1-4.png "pod"
