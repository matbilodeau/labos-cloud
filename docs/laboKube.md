# Laboratoire sur Kubernetes
Ce laboratoire vise à vous familiariser avec l'utilisation de **Kubernetes**. Il est fortement recommandé de faire les exercices dans l'ordre et de bien exécuter toutes les commandes, surtout celles se terminant avec `--help`. Plusieurs commandes expliquées dans les premiers exercices ne seront que mentionnées dans les suivants. Utilisez les liens pour accéder à de la documentation sur les diverses commandes ou outils présentés.

Ce laboratoire vous permettra d'installer les outils et d'interagir avec **Kubernetes**, de créer et modifier des ressources.

## Pré-requis
Avant de commencer, assurez-vous d'avoir une connaissance de base de **Docker**, par exemple en complétant les exercices disponibles [ici][0]. Une connaissance de base de Linux est un atout.

Bien qu'il soit possible d'[installer][3] et d'exécuter Kubernetes localement, ce laboratoire est monté dans une optique d'utilisation _cloud_. Plusieurs fournisseurs cloud offrent des services Kubernetes, nous utiliserons ici la solution clé en mains [Google Kubernetes Engine][4]. **Google Cloud Platform** offre un crédit de 300$ valide pour une durée de 90 jours.

Un compte gratuit *Docker hub* est recommande si vous voulez construire et utiliser vos propres images de container.

## Installation de gcloud sdk
À partir d'Ubuntu, armez-vous de votre meilleur copier-coller et exécutez les instructions [ici][5].
Attention, si vous utilisez un autre système d'opération les instructions sont [différentes][6].

## Installation de kubectl
À partir d'Ubuntu, armez-vous de votre meilleur copier-coller et exécutez les instructions [ici][7].
Attention, si vous utilisez un autre système d'opération les instructions sont [différentes][8].

## Introduction
Premièrement, il faut se renseigner sur ce qu'est [**Kubernetes**][9] et sur ses [composantes][10].


### Poursuivre avec l'[exercice 1][2]


[0]: ./laboDocker.html
[2]: ./laboKube0.html

[3]: https://kubernetes.io/fr/docs/setup/
[4]: https://cloud.google.com/kubernetes-engine/
[5]: https://cloud.google.com/sdk/docs/install#deb
[6]: https://cloud.google.com/sdk/docs/install#linux
[7]: https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/#installation-%C3%A0-l-aide-des-gestionnaires-des-paquets-natifs
[8]: https://kubernetes.io/fr/docs/tasks/tools/install-kubectl/
[9]: https://kubernetes.io/fr/docs/concepts/overview/what-is-kubernetes/
[10]: https://kubernetes.io/fr/docs/concepts/overview/components/
