#Auteur : EUILLOT Quentin

#Commentaires : 

- Factoriser les 3 "sreens" : Séparer les fonctions et les différents styles pour avoir un projet plus lisible

- Faire fonctionner l'ordre des photos dans la flatList, elles ne sont pas dans l'ordre chronologique (j'ai réussi à le faire, mais en ajoutant la longitude et la latitude, j'ai beaucoup trop complexifié le code et je n'ai pas réussi à remettre en place l'ordre)

- Enregistrer les markers lorsqu'on quitte l'application via Async Storage


#Architecture :

- Components : séparation en trois dossiers : Camera / Location / Pictures
Dans ces dossiers on a les fonctions principales pour nos différentes pages.

- Navigation : La gestion de la navigation entre les différentes pages

- Screens : Les trois pages avec leur rendu, quelques fonctions sont à déplacer correctement dans les fichiers components.
