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

```bash
curl --data "barcode=validationisaluxury" https://localhost:5000/api/report
```
