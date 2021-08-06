# HeavenRP

## Les commandes

### La commande *item*

Gère les items dans le RP.

| Subcommand | Usage                                        | Permissions | Description                                              |
|:----------:|----------------------------------------------|:-----------:|----------------------------------------------------------|
| create     | `!item create <itemname>`                    | admin       | Crée un item avec le nom spécifié dans le salon courent  |
| delete     | `!item delete <itemname>`                    | admin       | Supprime l'item spécifié dans le salon courent           |
| price      | `!item price <itemname> <count>`             | admin       | Change le prix de l'item spécifié du salon courent       |
| give       | `!item give <count> <itemname> <@mention>`   | admin       | Donne *n* items spécifiés du salon courent à *@mention*  |
| remove     | `!item remove <count> <itemname> <@mention>` | admin       | Retire *n* items spécifiés du salon courent à *@mention* |
| use        | `!item use <count> <itemname>`               | everyone    | Utilise *n* items spécifiés du salon courent             |

### La commande *inventory* ou *inv*

Gère les inventaires dans le RP.

| Subcommand | Usage                         | Permissions | Description                                         |
|:----------:|-------------------------------|:-----------:|-----------------------------------------------------|
| clear      | `!inventory clear <@mention>` | admin       | Retire tous les items de l'inventaire de *@mention* |
| see        | `!inventory see <@mention?>`  | admin       | Affiche l'inventaire de *@mention*                  |
| see        | `!inventory see`              | everyone    | Affiche son propre inventaire                       |

### La commande *dollar*

Gère les dollars dans le RP.

| Subcommand | Usage                               | Permissions | Description                     |
|:----------:|-------------------------------------|:-----------:|---------------------------------|
| give       | `!dollar give <count> <@mention>`   | admin       | Donne *n* dollars à *@mention*  |
| remove     | `!dollar remove <count> <@mention>` | admin       | Retire *n* dollars à *@mention* |
| set        | `!dollar set <count> <@mention>`    | admin       | Place *n* dollars à *@mention*  |

### La commande *shop*

Communique avec le shop dans le RP.

| Subcommand | Usage                                | Permissions | Description                                                          |
|:----------:|--------------------------------------|:-----------:|----------------------------------------------------------------------|
| buy        | `!shop buy <count> <itemname>`       | everyone    | Achète *n* items spécifiés du salon courent                          |
| sell       | `!shop sell <count> <itemname>`      | everyone    | Vend *n* items spécifiés du salon courent                            |
| see        | `!shop see`                          | everyone    | Affiche la liste des informations de tous les items du salon courent |

### La commande *help*

| Usage                  | Permissions | Description                                                   |
|------------------------|:-----------:|---------------------------------------------------------------|
| `!help`                | everyone    | Affiche les informations de toutes les commandes              |
| `!help <commandname>`  | everyone    | Affiche les informations concernant la commande *commandname* |

## Légendes

### Les différents types arguments

- `<count>` : est un nombre entier (>= -1) qui représente un nombre d'item ou un prix
- `<itemname>` : est une chaine de caractère (sans espace) qui représente un nom d'item
- `<@mention>` : est une mention d'un utilisateur ou d'un rôle qui représente des joueurs non-bot
- `<commandname>` : est une chaine de caractère (sans espace) qui représente un nom de commande

### Syntaxe
- `<param?>` : le paramètre est optionel
- `<param=value>` : le paramètre prend `value` comme valeur si il n'est pas spécifié
