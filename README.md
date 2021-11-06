# Egregious

A webapplication to scan products and send complaints about excess packaging.

## Dev

Install node/npm, then:

```bash
npm install --dev
npm run-script lint
npm run-script format
npm run-script build
npm run-script start
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
firefox index.html
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
