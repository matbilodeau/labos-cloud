## Exercice 4

### Service mesh
Déployer une application en microservices peut générer déploiements très complexes au niveau des communications entre les microservices, de l'observabilité et de la sécurité. Un _[service mesh][3]_ est un réseau de microservices qui agit parallèlement à l'application elle-même pour lui apporter des fonctionnalités opérationnelles, par exemple au niveau de la découverte et de la surveillance mais peut aussi fournir de l'authentification entre les services ou de la gestion de trafic.

**[Istio][4]** est un _service mesh_ _[open source][5]_ que l'on peut utiliser sur **[Kubernetes][0]** et dans une variété d'environnements.  Les fonctionnalités d'**Istio** sont rendues disponibles aux autres microservices du déploiement via un pod de type _[sidecar][6]_.

### Mise en place Istio
Créez un cluster de 4 noeuds, machine n1-standard-2, et la version de cluster la plus récente (`--cluster-version latest`). Assurez-vous que [kubectl est connecté][7] à ce cluster. Accordez les droits de _cluster-admin_ à l'utilisateur car il est nécessaire à la création de règles _RBAC_ pour **Istio**. `kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=$(gcloud config get-value core/account)`. À partir de votre répertoire "home/user", téléchargez **Istio** avec `curl -L https://istio.io/downloadIstio | sh -` puis suivez l'instruction qui sera affichée pour ajouter le répertoire **Istio** à la variable d'environnement _PATH_ avec (`export PATH`) et exécutez la vérification pré-installation `istioctl x precheck`.
L'installation utilise un [profil de configuration][8] pour le plan de contrôle et les sidecars qui peut être personnalisé. Pour l'exercice le profil "demo" sera utilisé `istioctl install --set profile=demo`. Examinez votre cluster, vous remarquerez qu'**Istio** utilise des ressources **Kubernetes** déployées dans un _namespace_ distinct.

![service mesh][img0]

### Déployer l'application
Il faut d'abord ajouter un _label_ au _namespace_ "default" pour activer l'injection automatique du _sidecar_ à l'application qui sera déployée `kubectl label namespace default istio-injection=enabled`.

Pour cet exercice, nous utiliserons l'application _[bookinfo][9]_ Pour construire nous même les images, il faut cloner le [repo d'**Istio**][10] car les fichiers _Dockerfile_ et le code source ne sont pas inclus dans le package téléchagé préalablement; le tutoriel utilise des images pré-construites. Déplacez le répertoire de l'application avec `mv istio/samples/bookinfo kubetest/` et entrez dans le répertoire "kubetest/bookinfo/" puis inspectez le contenu, le code source, les ressources **Kubernetes** ("platform/kube") et les fichiers _Dockerfile_. Examinez plus particulièrement "build_push_update_images.sh", c'est un script pour construire les images des microservices, les nommer et les publier avec un scan de vulnérabilités optionnel. Exécutez le script avec l'option de [scan de vulnérablités][11] activée; la commande `sudo ./build_push_update_images.sh 1.0.0 --prefix=user_dockerhub` est incomplète, référez-vous au code source. Le script met à jour automatiquement les _manifests_ pour référer au nom de vos image, par exemple "platform/kube/bookinfo.yaml". Plusieurs versions des microservices sont disponibles pour des fins de test, par exemple le service "ratings" peut avoir un comportement différent, en créant un délai ou en étant indisponible, selon la version utilisée. Vous pouvez visualiser les résultats des scans de vulnérabilités dans le répertoire "vulnerability_scan_results". À partir du répertoire "bookinfo", appliquez le manifest "platform/kube/bookinfo.yaml" et vérifiez le déploiement.

![services istio][img1]

Pour tester que l'application est fonctionnelle, exécutez `kubectl exec "$(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}')" -c ratings -- curl -s productpage:9080/productpage | grep -o "<title>.*</title>"`

### Ingress Gateway
Les microservices constituant l'application _bookinfo_ sont tous de type _ClusterIP_ et ne sont pas exposés à l'extérieur; une adresse IP externe est par contre fournie par un service _Istio Ingress Gateway_. Testez la connectivité à cette adresse avec `curl` et vous remarquerez qu'**Istio** n'autorise pas le trafic entrant par défaut. Examinez le fichier "networking/bookinfo-gateway.yaml". Le _[Gateway][12]_ est un service permettant de gérer le trafic entrant et sortant de l'application. **Istio** fourni par défaut un _Ingress Gateway_ avec les profils de configuration "default" et "demo", le _Egress Gateway_ est fourni par défaut seulement sur le profil "demo". Le _manifest_ crée aussi un _[Virtual service][13]_ qui sert ici à établir une règle de routage de base pour l'application en redirigeant le port 80 vers le service "productpage" sur le port 9080. Appliquez les modifications contenues dans ce _manifest_ à votre cluster. Vérifiez que l'application est accessible au "adresse.ip/productpage". Rechargez la page à quelques reprises.

![Ingress Gateway][img2]

### Destination rules
Vous avez remarqué que l'affichage diffère occasionnelement; les pods éligibles reçoivent les requêtes à tour de rôle. Le _pod_ "reviews" est disponible en 3 versions utilisant 3 images différentes. Pour stabiliser le routage des requêtes, il faut spécifier comment acheminer les requêtes avec des _[règles de destination][14]_. Le _manifest_ "networking/destination-rule-all.yaml" regroupe les différentes versions en subsets, ces subsets seront utilisé par un _Virtual service_ pour diriger les requêtes. Examinez puis appliquez le _manifest_ "networking/virtual-service-all-v1.yaml" pour acheminer les requêtes vers la version 1 de l'application. Rechargez la page, l'affichage devrait maintenant être le même après chaque requête.


### Dashboard
**Istio** est compatible avec diverses applications de télémétrie, copiez les fichiers de configuration avec `cp -r ~/istio-1.7.4/samples/addons ../` et appliquez les modifications avec `kubectl apply -f ../addons`. Exécutez la commande `istioctl dashboard kiali` pour accéder au tableau de bord de _Kiali_ et visualiser une cartographie des services du _namespace_ "default".


Vous pouvez supprimer votre cluster quand vous aurez terminé. Le même déploiement sera utilisé pour le prochain exercice.


### Revenir à l'[exercice 3][1]                  Poursuivre avec l'[exercice 5][2]

[0]: ./laboKube.html
[1]: ./laboKube2.html
[2]: ./laboKube4.html

[3]: https://en.wikipedia.org/wiki/Service_mesh
[4]: https://istio.io/latest/docs/concepts/what-is-istio/
[5]: https://github.com/istio/community
[6]: https://kubernetes.io/fr/docs/concepts/workloads/pods/pod-overview/#comprendre-les-pods
[7]: ./laboKube0.html
[8]: https://istio.io/latest/docs/setup/additional-setup/config-profiles/
[9]: https://istio.io/latest/docs/examples/bookinfo/
[10]: https://github.com/istio/istio/
[11]: http://imagescanner.cloud.ibm.com/
[12]: https://istio.io/latest/docs/concepts/traffic-management/#gateways
[13]: https://istio.io/latest/docs/concepts/traffic-management/#virtual-services
[14]: https://istio.io/latest/docs/concepts/traffic-management/#destination-rules

[img0]: ./img/kube/kube4-0.png "microservices"
[img1]: ./img/kube/kube4-1.png "services istio"
[img2]: ./img/kube/kube4-2.png "Ingress Gateway"
