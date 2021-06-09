## Exercice 2

### Interagir avec le cluster
Après la création du cluster [pour l'exercice 1][1] et lors de l'exécution de la commande pour obtenir les informations du [cluster][3], on obtient l'adresse ip du [_Master_][4]. Le cluster est aussi composé de 3 _nodes_. `gcloud container clusters describe` permet d'afficher de l'information détaillée sur le cluster; on voit l'adresse IP du _Master_, le _initialNodeCount_ mais il ne semble pas y avoir d'information sur les noeuds individuels. L'[aide-mémoire][5] de _kubectl_ indique comment visualiser et rechercher des ressources. `kubectl get pods -o wide` affiche plus de détails sur les _pods_, notamment sur quel noeud s'exécute chaque _pod_. Puisque les noeuds sont des [machines virtuelles][14] sur **Google Compute Engine**, il est possible de s'y [connecter][6]. Connectez-vous à un noeud exécutant un pod et inspectez les containers en cours d'exécution. Modifiez les valeurs pour le nom du déploiement et du pod dans le _manifest_ du déploiement pour "apache-deployment". Dans le _manifest_ du service changez le nom pour "apache-service", appliquez les modifications à votre cluster et inspectez de nouveau. Changer le nom d'un déploiement ne supprime pas l'ancien mais crée un nouveau déploiement distinct, ce qui explique pourquoi nous avons maintenant 4 _pods_.

![noeud pod container][img0]

`kubectl describe --help` permet d'obtenir plus d'informations sur les ressources **Kubernetes**. Comparez le résultat aux [valeurs][7] dans les _manifests_. Le nombre de _pods_ est défini par un _[ReplicaSet][8]_ créé dans un déploiement.  Pour changer le nombre de _replicas_, on peut utiliser la [commande][9] `kubectl scale --replicas=3 deployment/apache-deployment`. Pour activer la mise à l'échelle automatisée, il faut créer un _[Horizontal Pod Autoscaler][10]_. Cette ressource ajuste le nombre de _pods_ en exécution selon une ou des métriques qu'il faut spécifier dans le _manifest_ du déploiement. Modifiez le vôtre avec les valeurs suivantes puis appliquez les changements.

![deployment ressources][img1]

### Mise à l'échelle
Pour créer le _HPA_, utilisez `kubectl autoscale deployment apache-deployment --cpu-percent=3 --min=1 --max=8` et nous aurons entre 1 et 8 _pods_ basé sur la métrique d'utilisation du processeur à 3%. Pour voir l'autoscaler en action, `watch kubectl get hpa`. Notre application étant très peu sollicitée, générons de la charge de processeur en lançant un _pod_ qui effectuera des requêtes à l'infini. Dans un second terminal connecté au même hôte, exécutez `kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://apache-service; done"`. Vous pouvez lancez un 3e terminal et surveiller les _pods_. Sur GCP vous pouvez utiliser la Console, l'outil ligne de commande _gcloud sdk_ et une connexion avec un [outil tiers][11]. Pour arrêter le générateur de charge, `ctrl+c` dans le second terminal.

![autoscaling deployment][img2]

Pour mettre à l'échelle le cluster en ajoutant ou en retirant des noeuds, soit en créeant ou supprimant des machines virtuelles qui sont des ressources du [fournisseur cloud][12] et non de **Kubernetes**, on exécute `gcloud container clusters resize test-kubernetes --num-nodes 5` pour avoir 5 noeuds. Il est aussi possible de configurer l'[autoscaling de cluster][13] selon vos besoins. Vous pouvez supprimer votre cluster quand vous aurez terminé.


### Revenir à l'[exercice 1][1]                  Poursuivre avec l'[exercice 3][2]


[1]: ./laboKube0.html
[2]: ./laboKube2.html

[3]: https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture
[4]: https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture#control_plane
[5]: https://kubernetes.io/fr/docs/reference/kubectl/cheatsheet/#visualisation-et-recherche-de-ressources
[6]: https://cloud.google.com/compute/docs/instances/connecting-to-instance
[7]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/
[8]: https://kubernetes.io/fr/docs/concepts/workloads/controllers/replicaset/
[9]: https://kubernetes.io/fr/docs/reference/kubectl/cheatsheet/#mise-%C3%A0-l-%C3%A9chelle-de-ressources
[10]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
[11]: https://cloud.google.com/compute/docs/instances/connecting-advanced#windows-putty
[12]: https://cloud.google.com/kubernetes-engine/docs/how-to/resizing-a-cluster
[13]: https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-autoscaler
[14]: https://cloud.google.com/kubernetes-engine/docs/concepts/node-images

[img0]: ./img/kube/kube2-0.png "noeud pod container"
[img1]: ./img/kube/kube2-1.png "deployment ressources"
[img2]: ./img/kube/kube2-2.png "autoscaling deployment"
