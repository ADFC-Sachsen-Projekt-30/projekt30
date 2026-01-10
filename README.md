# projekt30

Projekt 30 Prototype

Main branch gets deployed to: https://adfc-sachsen-projekt-30.github.io/projekt30/

# Local Development

A basic [Preact](https://preactjs.com/) + [Typescript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/) + npm app.

Monorepo file layout.

App lives in [`apps/web`](/apps/web):

`cd apps/web`

## Install dependencies:

- `npm install`

## Dev-Server

- `npm run dev` and open http://localhost:5173/projekt30/ in your browser
- `npm run ngrok` shortcut to run ngrok tunneling the dev-server url and show
  a qrcode to open its url with your phone
  For this to work, first install [ngrok](https://ngrok.com) and setup a free
  account and then install the ngrok-qrcode script dependencies in
  `cd scripts/ngrok-qrcode` with `npm install`.

## Typechecks

- `npm run typecheck` to just run the Typescript checks without building any code

## Linting & Code-styles

- `npm run lint` to run eslint
- `npm run prettier-check` to check code formatting
- `npm run prettier-write` to fix code formatting

## Local Build

- `npm run build` to typecheck and build the app into `/dist`
- `npm run preview` to run the build
