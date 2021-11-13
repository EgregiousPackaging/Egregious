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

## Production

We have an VPS instance running at `51.195.149.81`.
It runs the cheapest [OVH instance](https://www.ovhcloud.com/en-gb/vps/compare/).

It was provisioned as debian with docker installed.
Additional manual configuration:

- `sudo apt install docker-compose rsync`
- Disabled password auth for ssh
  - In `/etc/ssh/sshd_config`:
    ```
    # PasswordAuthentication yes
    AuthenticationMethods publickey
    ```

The only user is the default `debian`

### SSH access

Add you public key as a new line to `./scripts/public_keys` and CI will copy to the instance when you merge to `main`.
You can then access the instance as the `debian` user.

### Deployment

This is done in CI with github actions using a private key stored in the repos secrets.
See:

- `.github/workflows/prod.yml`
- `./scripts/deploy.sh`

#### Testing CI

You can use (act)[https://github.com/nektos/act] to check the workflows are working.

```bash
# make sure the private key doesn't need decrypting or else it'll hang when trying to access it
# also this will do a real deploy, -n for dry run
sudo act -s DEPLOYMENT_SSH_KEY="myprivatekey"
```
