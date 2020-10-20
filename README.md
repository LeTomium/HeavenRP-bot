# HeavenRP

## Les commandes

### La commande *item*

Gère les items dans le RP.

| Subcommand | Usage                                          | Permissions | Description                                              |
|------------|------------------------------------------------|-------------|----------------------------------------------------------|
| create     | `!item create [itemname]`                      | admin/modos | Crée un item.                                            |
| delete     | `!item delete [itemname]`                      | admin/modos | Supprime un item.                                        |
| give       | `!item give [@username] [itemname] [count=1]`  | admin/modos | Ajoute *n* item(s) à *@username*.                        |
| clear      | `!item clear [@username] [itemname] [count=1]` | admin/modos | Retire *n* item(s) à *@username*.                        |
| use        | `!item use [itemname] [count=1]`               | everyone    | Utilise *n* item(s).                                     |
| see        | `!item see [@username] [itemname]`             | everyone    | Affiche le nombre d'item de *@username*.                 |
| ×, help    | `!item help`                                   | everyone    | Affiche les informations concernant la commande `!item`. |

### La commande *inventory*

Gère les inventaires dans le RP.

| Subcommand | Usage                          | Permissions | Description                                                   |
|------------|--------------------------------|-------------|---------------------------------------------------------------|
| clear      | `!inventory clear [@username]` | admin/modos | Réinitialise l'inventaire de *@username*.                     |
| see        | `!inventory see`               | everyone    | Affiche son propre inventaire.                                |
|            | `!inventory see [@username]`   | everyone    | Affiche l'inventaire de *@username*.                          |
| ×, help    | `!inventory help`              | everyone    | Affiche les informations concernant la commande `!inventory`. |

### La commande *dollar*

Gère les dollars dans le RP.

| Subcommand | Usage                                | Permissions | Description                       |
|------------|--------------------------------------|-------------|-----------------------------------|
| give       | `!dollar give [@username] [count]`   | admin/modos | Donne *n* dollars à *@username*.  |
| remove     | `!dollar remove [@username] [count]` | admin/modos | Retire *n* dollars à *@username*. |
| set        | `!dollar set [@username] [count]`    | admin/modos | Place *n* dollars à *@username*.  |

### La commande *shop*

Communique avec le shop dans le RP.

| Subcommand | Usage                              | Permissions | Description                                              |
|------------|------------------------------------|-------------|----------------------------------------------------------|
| see        | `!shop see`                        | everyone    | Affiche toutes informations de tous les items du shop.   |
|            | `!shop see [itemname]`             | everyone    | Affiche les informations de l'item (prix).               |
| price      | `!shop price [itemname] <count=0>` | admin/modos | Change le prix de l'item.                                |
| buy        | `!shop buy [itemname] [count=1]`   | everyone    | Achète *n* item(s).                                      |
| sell       | `!shop sell [itemname] [count=1]`  | everyone    | Vend *n* item(s).                                        |
| ×, help    | `!shop help`                       | everyone    | Affiche les informations concernant la commande `!shop`. |

### La commande *help*

Affiche les informations des commandes dans le RP.

| Subcommand | Usage             | Permissions | Description                                                   |
|------------|-------------------|-------------|---------------------------------------------------------------|
| item       | `!help item`      | everyone    | Affiche les informations concernant la commande `!item`.      |
| inventory  | `!help inventory` | everyone    | Affiche les informations concernant la commande `!inventory`. |
| dollar     | `!help dollar`    | everyone    | Affiche les informations concernant la commande `!dollar`     |
| ×          | `!help`           | everyone    | Affiche les informations concernant la commande `!help`.      |
