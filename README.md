# mausritter-sheet
**Mausritter Character Sheet** is a web application for **Mausritter** mice character sheet.

> Mausritter is about small-scale adventurers in a huge world. Mouse adventurers who take on big challanges and face down grave danger.

Have a look at [Mausritter website](https://mausritter.com/) and [Licence](./LICENSE.md).

## Features
- Play your mouse
- Create a random mouse (implement Mouse creation rules from Mausritter Rules book),
- Translated in English and Français,
- Manage hirelings,
- Roll dices with/without advantage or disadvantage,
- Drag'n'drop items or conditions on inventory slots
- Drag'n'drop in grit.
- Drag'n'drop in bank, retrieving item from bank cost 1% of its price.
- History of dices and other actions.
- Save and load whole character sheet from local storage. 10 slots are available.
- Import / Export of character sheet.

See [TODO.md](./src/TODO.md) for incomming features :-)

![Exemple Sheet 0.1.1](./live.gif)

## Installation

To soon to have one ;-)

## For developpers
This application is made with [Vue.js 3](https://v3.vuejs.org/) and [wave-ui](https://antoniandre.github.io/wave-ui/).

```
npm ci
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Lints and fixes files
```
npm run lint
```

### Compiles and minifies for production
```
npm run build
```

### Build and run a docker container
If you use **docker-compose**:
```
docker-compose up --build
```
or, with **docker**:
```
npm run build:docker
npm run serve:docker
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
