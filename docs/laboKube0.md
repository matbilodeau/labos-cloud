## Exercice 1

### Premier pas
Exécutez `gcloud config list` puis `kubectl version` pour vérifier que vous êtes connectés au bon projet et que les utilitaires sont bien [installés][0].

Pour créer un cluster Kubernetes avec l'outil _gcloud sdk_ utilisez la commande `gcloud container clusters create test-kubernetes`. Ce cluster sera créé avec les paramètres par défaut, notamment trois _nodes_. Créez et entrez dans le répertoire "kubetest" puis clonez le repo **GitHub** suivant: "https://github.com/matbilodeau/test-apache-kube". La commande est `git clone https://github.com/matbilodeau/test-apache-kube`. Entrez dans ce répertoire et explorez le contenu.

### Pour créer votre propre image
Construisez l'image à partir du fichier _Dockerfile_ fourni avec un nom:tag conforme pour la publication vers votre [repo][3] puis publiez-la. Modifiez le fichier "apache-deployment.yaml" en conséquence. Continuez avec les instructions ci-dessous.

### Pour utiliser une image publique
_Kubectl_ est un utilitaire permettant d'interagir avec le [plan de contrôle][4] Kubernetes via la composante _kube-apiserver_. Kubernetes prend ses instructions sous forme de fichiers ".yaml". Exécutez `kubectl --help`. Pour appliquer les modifications selon les fichiers fournis ([pods][5], [deployment][6], [services][7], [ingress][8]), il faut utiliser `kubectl apply -f .` ce qui créera toutes les ressources décrites dans les fichiers ".yaml". La commande `kubectl get --help` sert à afficher des informations sur différents types de ressources. Affichez les ressources crées avec `kubectl get pods`, `kubectl get services` et `kubectl get deployments`. L'utilitaire _watch_ permet de répéter une commande et d'afficher le résultat, ce qui peut être très pratique pour surveiller la création de vos ressources, par exemple avec `watch kubectl get ingress`. `kubectl get nodes` affiche les [noeuds][9] du cluster auquel nous sommes connectés avec _kubectl_.

Prenez note qu'il peut y avoir un certain délai avant que la page web ne soit disponible. Le fichier index.html propose d'afficher le hostname mais il affiche celui de l'_url_. Le fichier "index2.html" affiche ce qui ressemble à un _CONTAINER ID_. Il s'agit en fait d'un container intermédiaire lors de la construction de l'image.

![container intermédiaire][img0]

Si vous avez construit vous même votre image, enlevez le _#_ devant _echo_ dans le fichier "entrypoint.sh" puis reconstruisez l'image, par exemple avec un tag "v2". Modifiez le fichier "apache-deployment.yaml" pour utiliser "matbilodeau/test-apache-kube:v2" ou la vôtre. Rechargez le fichier "index2.html". Vous avez maintenant l'information du pod qui a répondu à la requête _http_.

![pod][img1]

L'explication de la différence entre les deux affichages se trouve dans les instructions de [_RUN_][10] et [_ENTRYPOINT_][11], plus particulièrement le moment où ils s'exécutent.

Pour tout supprimer, utilisez directement `gcloud container clusters delete test-kubernetes`. Le même déploiement est utilisé pour l'exercice 2

### Poursuivre avec l'exercice 2 (à venir)


[0]: ./laboKube.html

[3]: https://docs.docker.com/docker-hub/repos/
[4]: https://kubernetes.io/fr/docs/concepts/overview/components/#composants-master
[5]: https://kubernetes.io/fr/docs/concepts/workloads/pods/pod/
[6]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[7]: https://kubernetes.io/docs/concepts/services-networking/service/#publishing-services-service-types
[8]: https://kubernetes.io/docs/concepts/services-networking/ingress/
[9]: https://kubernetes.io/fr/docs/concepts/architecture/nodes/
[10]: ./laboDocker2.html
[11]: ./laboDocker4.html

[img0]: ./img/kube/kube1-0.png "image intermédiaire"
[img1]: ./img/kube/kube1-0.png "pod"
