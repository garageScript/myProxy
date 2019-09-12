# [MyProxy](http://innout.life:3000/) &middot; [![CircleCI](https://circleci.com/gh/garageScript/myProxy.svg?style=svg)](https://circleci.com/gh/garageScript/myproxy)
MyProxy is an application that proxies requests to other servers

# Prerequisites

- [x] To run **myProxy** first of all you'll need a server with **Node,js** and **Git** installed

- [x] A valid Domain name `Eg: mydomain.com`

# How to install

Connect to your server:

```bash
ssh user@my_server_ip
```

Clone the app:

 ```bash
 git clone https://github.com/garageScript/myProxy.git
 ```

Go to myProxy folder:

```bash
cd myProxy/
```

Set it up:

```bash
npm run setup
```

> Will install [acme.sh](https://github.com/Neilpang/acme.sh) and all dependencies

Run the app:

```bash
ADMIN=my_admin_password npm run start
```

> You can also run the app under your own defined port by setting a `PORT` environment variable
All environment variable can be setup into your `.env`

# Contribution

The following steps will guide you through how to setup your development environment to send pull requests or build your own custom features.

## Running the app

1. You need to install node and typescript

2. First install dependencies: `npm install` or `yarn`

3. Run the app: `yarn start` or `npm run start`

> You can also run the app under your own defined port by setting a `PORT` environment variable

## Before sending a Pull Request

1. Run `npm run autofix`: make sure there are no errors / warnings

## License

myProxy is [MIT licensed](https://github.com/garageScript/myProxy/blob/master/LICENSE)
