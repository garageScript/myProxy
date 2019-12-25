# [MyProxy](https://garagescript.github.io/myProxy/) &middot; [![CircleCI](https://circleci.com/gh/garageScript/myProxy.svg?style=svg)](https://circleci.com/gh/garageScript/myproxy)
MyProxy is an application that proxies requests to other servers

# Prerequisites

- [x] To run **myProxy** first of all you'll need a server with **Git** installed

- [x] A valid Domain name `Eg: mydomain.com` (Currently supported providers: GoDaddy)

# Installation and Usage 

## AWS Setup

Update VM's firewall configuration match table below during security group setup on AWS EC2 instance. 

| Type | Protocol | Port Range |   Source  |
|:---:|:--------:|:----------: | :------:  |
| HTTP |  TCP     | 80         | 0.0.0.0/0 |
| HTTPS|  TCP     | 443        | 0.0.0.0/0 |
| SSH  |  TCP     | 22         | 0.0.0.0/0 |
| Custom TCP Rule | TCP | 3000 | 0.0.0.0/0 |
| Custom TCP Rule | TCP | 9418 | 0.0.0.0/0 |

## Google Cloud Setup

**Google Cloud User Only** 
 - Target: `specify target tags`
 - Target Tags: `myproxy`
 - Source Filter: `IP ranges`
 - Source IP: `0.0.0.0/0`
 - Specify Protocol and Ports: `tcp: 3000`

Update Google VMs to specify `myproxy http-server https-server` in network tags


## Installation

Connect to your server:

```bash
ssh root@my_server_ip
```

For AWS users, change to root user:

```bash
sudo su root
cd ~
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
./scripts/setup.sh
```

> Will install [acme.sh](https://github.com/Neilpang/acme.sh) and all dependencies

Run the app:

```bash
ADMIN=my_admin_password npm run server
```

> You can also run the app under your own defined port by setting a `PORT` environment variable  
> All environment variable can be setup into your `.env`

Exit the server: 

```bash
exit
```

## Usage

Go to server URL:
```
http://your-server-ip-address:3000
```

You will be prompted to enter your admin password and your domain provider's API Key and Secret, [find out how here](https://github.com/Neilpang/acme.sh/wiki/dnsapi)

After your domain is setup, you will be able to generate as many subdomain repository as you want! To do that:
1. Go to your server url:  `http://your-server-ip-address:3000`
2. Create a subdomain. Ip and port are optional. You should see a git link that was created for you.
3. `git clone` the app, then build the app locally. Find out how in the Building Your Local App section below.
4. When you are done, `git push origin master` and watch your app run in production!


## Building-Your-Local-App 
1. In the terminal, run `git clone <your fullDomain repo>` to clone your app folder.
2. Enter your repo `cd <your fullDomain folder>`
3. Run `npm init -y`
4. Run `npm i express --save`
5. Run `touch app.js`
6. Copy the following code into app.js.

```javascript
const express = require('express');
const app = express();
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(process.env.PORT || 8123);
```

7. Update scripts section of package.JSON with `"start:myproxy": "node app.js"`
8. Run `git add .`
9. Run `git commit -m "Initial Commit"`
10. Run `git push origin master`

# API Reference

Users can use Access Tokens to manage their domain mappings from a 3rd party server.
[See available endpoints](https://github.com/garageScript/myProxy/wiki/API)

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
