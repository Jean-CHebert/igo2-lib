
******************************
Tour interactif configuration
******************************

Sommaire
===============

Il est possible de configurer un tour interactif qui présentera l'application. La librairie utiliser est Intro.js (mettre le lien)
Plusieurs tour de présentation sont possibles, un tour général et des particuliers pour présenter chaqu'un des outils. Chaque
tour a sa propre configurations. Les tours sont constitués de plusieurs étapes, des 'steps'. Chaque step met en surbrillance
certains éléments de l'application et affiche un message de description de l'élément. Le pilote peut ainsi configurer plusieurs
'step' à son tour interactif. En plus de sélectionner des éléments à mettre en surblillance, le pilote peux aussi configurer
certaines actions lors du tour.

Exemples

  .. code:: json

      "introOptions" :{
        "skipLabel": "<h3 style='color:blue'>Fermer </h3>",
        "nextLabel": "<h3 style='color:blue'>Suivant</h3>",
        "prevLabel": "",
        "doneLabel": "Terminé",
        "hidePrev": true,
        "hideNext": true,
        "positionPrecedence": ["right", "bottom", "top", "left"],
        "showStepNumbers": false,
        "disableInteraction": true,
        "highlightClass":"igo-introjs-helperLayer",
        "buttonClass":"mat-raised-button",
        "tooltipClass":"mat-h2",

        "steps": [
          {
            "element": "menu-button",
            "intro": "MENU <br> Ouvre et fermer le menu",
            "position": "right",
          },
          {
            "element": "igo-search-bar-container",
            "intro": "BARRE RECHERCHE <br> Saisir un nom de couche ,de ville, d'adresse, point GPS, etc"
          }
        ]
      }


Configurer les tours
---------------------

Chaque tour possède des options de configuration qui s'appliqueront à CE tour et/ou s'appliqueront a chaque step de ce tour.
Voir les propriétés disponible de la librarie intro.js ici: (mettre le lien)


Configurer les steps du tours
--------------------------------

Chaque step est constitué d'au minimum 2 éléments. Le premier "element" correspond à l'élément HTML qui doit être mis en
surbrillance. On peux lui mettre un nom ID, de CLASSE ou tout élément qui peux être retrouvé via :
document.getElementsByTagName(), document.getElementsByClassName(), document.querySelector(), document.getElementById()
le second est "intro" ou est inscrit le message de la boite. Du HTML peut y être inséré.

NB: attention à la séquense que prendra votre tour, l'élément doit être visible au moment ou le step est déclanché pour être
mis en surbrillance.


Exemples

  .. code:: json

    {
      "steps": [
        {
          "element": "menu-button",
          "intro": "element est un ID",
          "position": "right"
        },
        {
          "element": "igo-search-bar-container",
          "intro": "<h3>element igo</h3>"
        },
        {
          "element": "igo-actionbar-item:nth-child(2)",
          "intro": "le child 2 de <strong>l'élément</strong> igo-actionbar",
        }
      ]
    }



Steps, propriétés en options
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

En plus des 2 propriétées essentielles a chaque step, il est possible d'en ajouter d'autre, par exemple
"position": "right", pour que cette boite de message particulière ce place à droite de l'élément en surbrillance.
Voir la librairie IntroJS et les propriétés disponibles sur les steps: (mettre le lien)

 ** NB: Les index des éléments sont ceux des éléments de l'application, il se peut donc qu'il ne pas débute pas à 1, par
 exemple lorsque l'élément filtre de couche est présent ou non dans une liste, l'index ne sera pas le même. Particulièrement
 lorsqu'on sélectionne un élément avec "nth-child(x)". Exemple pour sélection élément du 1er context lorsque le filtre de contexte
 est présent vous devrez mettre dans 'element': 'igo-context-item:nth-child(3)' et se même si vous voulez sélectionner le 1er...


Steps, actions
^^^^^^^^^^^^^^^^^^^^^
Il est possible de réaliser des actions lors d'un step. Pour ce faire simplement ajouter action dans les propriété
du step et indiquer l'action voulu.
  Actions possibles:

    - clickOnMenu : Cliquer sur le bouton menu, si ce dernier est ouvert, il se fermera sinon il ouvrira.
    - clickOnToolX : Cliquer sur l'outil numéro X. Remplacer le X par le numéro d'outil voulu. Attention le numéro est fonction de
                 l'ordre de présentation des outils. L'outil 5 n'est pas toujours le même en fonction des applications.
    - clickOnContextX : Cliquer sur le context X. Remplacer le X par le numéro du context.
    - clickOnLayerX: Cliquer sur le context X. Rempalcer le X par le no du layer.
    - clickOnElem : Cliquer sur l'élément qui est sélectionné dans la propriété élément. NB: Pour fonctionner, l'élément
              html doit avoir une fonction click. Il doit être possible d'effectuer dessus element.click().

** NB: Les index des actions débute toujours à 0
      Les éléments doivent être visibles et sélectionnables au moment ou est lancé le step.

Exemples

	.. code:: json

    "steps": [
        {
            "element": "menu-button",
            "intro": "MENU CLICK<br> En appuyant sur le bouton menu, le menu général ouvre",
            "position": "right",
            "action": "clickOnMenu"
        },

        {
            "element": ".igo-panel-title",
            "intro": "Clique sur l'outil 1",
            "action": "clickOnTool1"
        },
        {
          "element": "igo-list",
          "intro": "cliquer sur le contexte no 2",
          "action": "clickOnContext2",
          "position": "right"
        },
        {
          "element": "igo-layer-item:nth-child(3)",
          "action": "clickOnLayer1",
          "intro": "Cliquer sur le titre de couche -> la légende ouvre"
        },
        {
          element: 'igo-layer-item:nth-child(2) button',
          intro: "click sur bouton oeil ->  Active et désactive  la couche",
          action: 'clickOnElem',
        }
    ]




Propriétés

    .. list-table::
       :widths: 10 10 30 15 10
       :header-rows: 1

       * - .. line-block::
               Propriétés
         - .. line-block::
               Type
         - .. line-block::
               Description
         - .. line-block::
               Valeurs possibles
         - .. line-block::
               Valeur défaut
       * -
         -
         - .. line-block::
               Desc
         - enum?
         - val

Important : Les propriétés en caractère gras suivis d'un * sont obligatoires.

Liens

        - `igo2-lib/packages/core/src/style/themes <https://github.com/infra-geo-ouverte/igo2-lib/tree/master/packages/core/src/style/themes>`_
        - `igo2-lib/packages/core/src/style/themes <https://github.com/infra-geo-ouverte/igo2-lib/tree/master/packages/core/src/style/themes>`_
