# mausritter-sheet
**Mausritter Character Sheet** is a web application for **Mausritter** mice character sheet. You can use it, freely, from https://mausritter-sheet.dco.ninja.

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
- Save and load whole character sheet from local storage. 12 slots are available. All data is saved in your browser, no server is needed.
- Import / Export of character sheet. Use this to load a character into another browser.
- Mouse can rest and advance in level, up to level 20.

![Version 1.3.9](/public/img/mausritter-sheet-fr-dices.jpg)

See [TODO.md](./src/TODO.md) for incomming features :-)

![Exemple Sheet 0.1.1](./live.gif)

## Companions
**FUTURE** Another great Mausritter application *will be* [Mausritter-Colony](https://github.com/yar0d/mausritter-colony) for GM to manage their game session.

## Installation (beta)

The desktop applications are in **beta** and should be used just for testing. They still contain bugs! They are available for Microsoft Windows, Apple Mac OS and GNU Linux. At this time, there is no mobile (Android or iOS) version.

To download, go to https://github.com/yar0d/mausritter-sheet/releases and search for the latest release named *Application release*.

## For developpers
This application is made with [Vue.js 3](https://v3.vuejs.org/) and [wave-ui](https://antoniandre.github.io/wave-ui/).

For desktop application, I use [Tauri](https://tauri.studio/en/).

Clone this repository and, install dependencies with `yarn`.

### Compiles and hot-reloads for development
```
yarn serve
```

### Compile and hot-reloads for desktop application
```
yarn serve:tauri
```

### Lints and fixes files
```
yarn lint
```

### Compiles and minifies for production
```
yarn build
```

### Build a desktop application
```
yarn build:tauri
```
This will build a native application for your computer.

### Build and run a docker container
If you use **docker-compose**:
```
docker-compose up --build
```
or, with **docker**:
```
yarn build:docker
yarn serve:docker
```

### FTP deploy
1. Publish a release with `yarn release:publish`
2. Build with `yarn build`. We now have a **dist** folder.
3. Send all content on the **dist** folder to you FTP server.

### Create a release
A release will contains all binaries for MacOS, Windows and Linux.

1) Increment application version with `yarn release:publish` on **main** branch.
2) Create a **pull request** for base: **release** to compare: **main**.
3) Merge this pull request. This will trigger publish action. It takes about 15 minutes to complete and have a draft of the release in https://github.com/yar0d/mausritter-sheet/releases.
4) Edit the draft to your needs.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

