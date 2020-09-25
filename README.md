# [MyProxy](https://garagescript.github.io/myProxy/) &middot; [![CircleCI](https://circleci.com/gh/garageScript/myProxy.svg?style=svg)](https://circleci.com/gh/garageScript/myproxy)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
MyProxy is an alternative to Nginx that allows automatic domain provider integration, ssl support for all domains, dynamic port proxy
and automatic git deployment. 

MyProxy helps you quickly and easily:
* Connect to your Domain provider
* Set up A and CNAME records for your selected domains
* Create and serve SSL certificates for your selected domains
* Run an unlimited number of applications on your subdomains

Watch the following videos to understand how MyProxy works:

[Using MyProxy to deploy apps](https://www.youtube.com/watch?v=Tjx0BtpZmPc)

[Setting up MyProxy on your server](https://www.youtube.com/watch?v=q3uSyMfaRP4)

## Try it out?
Try it out on one of our open source partners providing a heroku alternative: https://freedomains.dev/

## Why?
Setting up a server is hard - especially setting up DNS records, managing certificates, and deployment. So we setup to build a simple and easy-to-use app that helps us build applications quickly.

We are new to software engineering so if you find areas where this app could be improved, please let us know by [creating an issue](https://github.com/garageScript/myproxy/issues). We are excited to learn!

Also, we are currently seeking jobs. If your team needs software engineers, please reach out:
* [Alberto Lopez](https://www.linkedin.com/in/albertolopez-siliconvalley/) - Available immediately
* [David De Wulf](https://dewulfdavid.com) - Open to new opportunities
* [Rahul Kalra](https://www.linkedin.com/in/voterknow) - Available immediately
* [Sahil Kalra](https://www.linkedin.com/in/s1kalra/) - UC San Diego senior, graduating June 2020
* [Herman Wong](https://www.linkedin.com/in/hw335/) - Open to new opportunities

## Prerequisites
To use `MyProxy`, you need 3 things:
1. A domain name. MyProxy uses [acme.sh](https://github.com/Neilpang/acme.sh/wiki/dnsapi), so you would have to buy the domains from any of the [DNS APIs listed there](https://github.com/Neilpang/acme.sh/wiki/dnsapi) (includes all of the major providers like namecheap, goDaddy, etc.)
2. A server's IP address that you have root access to. You can use your home server or get one from [AWS EC2](https://aws.amazon.com/ec2/?hp=tile&so-exp=below), [DigitalOcean](https://www.digitalocean.com/), [GoogleCloud](https://cloud.google.com/), etc.
3. Docker needs to be installed on the server. MyProxy uses Docker to run deployed apps inside containers.

# Installation and Usage 

## Server setup
We tested MyProxy on the AWS and Google Cloud platforms. If you use them, please follow the configurations and setup below to make sure MyProxy works well for you. 

### AWS Setup
You will need to configure the VM's firewall per table below during security group setup on AWS EC2 instance.

| Type | Protocol | Port Range |   Source  |
|:---:|:--------:|:----------: | :------:  |
| HTTP |  TCP     | 80         | 0.0.0.0/0 |
| HTTPS|  TCP     | 443        | 0.0.0.0/0 |
| SSH  |  TCP     | 22         | 0.0.0.0/0 |
| Custom TCP Rule | TCP | 3000 | 0.0.0.0/0 |
| Custom TCP Rule | TCP | 9418 | 0.0.0.0/0 |

### Google Cloud Setup

 - Target: `specify target tags`
 - Target Tags: `myproxy`
 - Source Filter: `IP ranges`
 - Source IP: `0.0.0.0/0`
 - Specify Protocol and Ports: `tcp: 3000`

Update Google VMs to specify `myproxy http-server https-server` in network tags

## Installation

1. Connect to your server: `ssh root@your-server-ip-address`
  * **AWS Users Only**  Change to root user `sudo su root` and change to home folder `cd ~`
2. Install Docker on your server, follow the instructions for your OS at the [Docker docs](https://docs.docker.com/engine/install/).
3. Clone the app: `git clone https://github.com/garageScript/myProxy.git`
4. Go to the MyProxy folder: `cd myProxy`
5. Run the setup script `./scripts/setup.sh` 
  * Installs `nodeJS` and `npm` if system does not have them.
  * Enables firewall port `3000` (for the admin page UI), `80` and `443`.
  * Installs application dependencies
  * For a complete list of commands the script runs, [look here](https://github.com/garageScript/myProxy/blob/master/scripts/setup.sh)
6. Run the App: `ADMIN=YOUR_ADMIN_PASSWORD npm run server` 
  * You can also run the app under your own defined port by setting a `PORT` environment variable
7. Exit from server `exit`

## Usage

1. Go to your server url: `http://your-server-ip-address:3000`. You will be prompted to enter your admin password and your domain provider's API Key and Secret, [find out how here](https://github.com/Neilpang/acme.sh/wiki/dnsapi)
2. All your domain names in that provider will show up. Click the **setup** button next to the domain you wish to setup (could take up to 5 minutes)
3. After your domain is setup, you will be able to generate as many subdomain repositories as you want! To do that:
    1. Go to your server URL:  `http://your-server-ip-address:3000`
    2. Create a subdomain. IP and port are optional. You should see a git link that was created for you.
    3. `git clone` the app, then build the app locally. Find out how in the **Building Your Local App section** below. 
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

7. Update the `scripts` section in `package.json` with your app entry point command, under `start`: `"start": "node app.js"`
8. Run `git add .`
9. Run `git commit -m "Initial Commit"`
10. Run `git push origin master`

# API Reference

Users can use Access Tokens to manage their domain mappings from a 3rd party server.
[See available endpoints](https://github.com/garageScript/myProxy/wiki/API)

# Development & Contribution
The following steps will guide you through how to setup your development environment to send pull requests or build your own custom features.

You need to install node and typescript

1. Fork and clone the repository.
2. Install dependencies: `npm install` or `yarn`
3. Run the app: `yarn start` or `npm run start`
  * You can also run the app under your own defined port by setting a `PORT` environment variable

## Adding a new provider
If your company sells domain names and you want your service to be supported on MyProxy, make sure you integrate with [acme.sh][DNS_API_integration] first.

[Sample integration](https://github.com/garageScript/myProxy/pull/355) for Name.com that you can follow along.

1. All implemented providers are listed in [`src/providers/index.ts`](https://github.com/garageScript/myProxy/blob/master/src/providers/index.ts). Add your service to `providerList`, following the your [`acme.sh`](DNS_API_integration) integration's naming convention.  
  * `path` should be the location of the file you create in the next step.
2. Create a file that exports the following functions: `getDomains` and `setRecord`. 
3. Depending on your API in the previous step, you may need to create types. Types should be added to [`src/types/general.ts`](https://github.com/garageScript/myProxy/blob/master/src/types/general.ts)

You are done! Get a beer 🍺

## Before sending a Pull Request:
1. Run `npm run autofix`: make sure there are no errors / warnings

# License

MyProxy is [MIT licensed](https://github.com/garageScript/myProxy/blob/master/LICENSE)

[DNS_API_integration]: https://github.com/Neilpang/acme.sh#8-automatic-dns-api-integration

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.c0d3.com/"><img src="https://avatars2.githubusercontent.com/u/686933?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Song Zheng</b></sub></a><br /><a href="https://github.com/garageScript/myProxy/commits?author=songz" title="Code">💻</a></td>
    <td align="center"><a href="https://www.devwong.com/"><img src="https://avatars1.githubusercontent.com/u/7990856?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Herman Wong</b></sub></a><br /><a href="https://github.com/garageScript/myProxy/commits?author=hwong0305" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/rkalra247"><img src="https://avatars1.githubusercontent.com/u/27792256?v=4?s=100" width="100px;" alt=""/><br /><sub><b>rkalra247</b></sub></a><br /><a href="https://github.com/garageScript/myProxy/commits?author=rkalra247" title="Code">💻</a></td>
    <td align="center"><a href="https://dewulfdavid.com/"><img src="https://avatars3.githubusercontent.com/u/25457563?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David De Wulf</b></sub></a><br /><a href="https://github.com/garageScript/myProxy/commits?author=Wolfy64" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/SahilKalra98"><img src="https://avatars1.githubusercontent.com/u/23374591?v=4?s=100" width="100px;" alt=""/><br /><sub><b>SahilKalra98</b></sub></a><br /><a href="https://github.com/garageScript/myProxy/commits?author=SahilKalra98" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/albertoelopez"><img src="https://avatars2.githubusercontent.com/u/40315201?v=4?s=100" width="100px;" alt=""/><br /><sub><b>albertoelopez</b></sub></a><br /><a href="https://github.com/garageScript/myProxy/commits?author=albertoelopez" title="Code">💻</a></td>
    <td align="center"><a href="https://c0d3.com/"><img src="https://avatars3.githubusercontent.com/u/29881336?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alberto Lopez</b></sub></a><br /><a href="https://github.com/garageScript/myProxy/commits?author=allopez7" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/bryanjenningz"><img src="https://avatars2.githubusercontent.com/u/7637655?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bryan Jennings</b></sub></a><br /><a href="https://github.com/garageScript/myProxy/commits?author=bryanjenningz" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!