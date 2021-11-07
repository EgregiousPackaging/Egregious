# Egregious

A webapplication to scan products and send complaints about excess packaging.

## Dev

Use the Node Version Manager (NVM) to install Node/NPM at the correct version:

```bash
nvm use

# if you get an error, install the project version of node then try again
nvm install 14.16
```

You can now generate a non-production build of the app

```bash
# build a dev build
npm run build:dev

# Start a local server
npm run start
```

At the moment, the only difference is how the frontend code is packaged. Prod builds are minified and don't include a source map; dev builds aren't and do.

### Auto rebuilds

Alternatively, you can use Nodemon to keep the builds building as you make changes.

HMR is a pain in the arse, so you'll have to refresh the page to load changes to the frontend right now.

```bash
npm run watch
```

See `scripts` in `package.json`.

## Test

### Server

```bash
curl --data "barcode=validationisaluxury" http://localhost:5000/api/report
```

### Client

- open page

```bash
firefox http://localhost:5000
```

- allow webcam
- scan an EAN barcode (the ones on CDs)
- should appear in console logs

## TODO

- move client to react
- have build process copy html files to `./dist`
- serve the Frontend files from the server
- docker/docker-compose setup to make running and test the server more reproducible
- CI config
  - probably github actions
- have Frontend JS send scanned barcodes to server API
- Have server store barcodes in a DB instead of memory
- refactor tsconfig files
  - move common config to a shared file they extend
