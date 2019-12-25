# MyProxy &middot; [![CircleCI](https://circleci.com/gh/garageScript/myProxy.svg?style=svg)](https://circleci.com/gh/garageScript/myproxy)
MyProxy is an application that helps you quickly and easily:
* Helps you connect to your Domain provider
* Set up A and CNAME records for your selected domains
* Create and serve SSL certificates for your selected domains
* Run an unlimited number of applications on your subdomains

To understand what MyProxy does for you, the video below walks you through how to create and deploy a new application as well as an existing application:

<div class="videoWrapper" >
     <iframe src="https://www.youtube.com/embed/Tjx0BtpZmPc?rel=0" frameborder="0" allowfullscreen></iframe>
</div>

If you want to install MyProxy into your own server, setup instructions are simple. Install MyProxy into your server and then connect the your domain name.

<div class="videoWrapper" >
     <iframe src="https://www.youtube.com/embed/q3uSyMfaRP4?rel=0" frameborder="0" allowfullscreen></iframe>
</div>

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
To use `MyProxy`, you need 2 things:
1. A domain name. MyProxy uses [acme.sh](https://github.com/Neilpang/acme.sh/wiki/dnsapi), so you would have to buy the domains from any of the [DNS APIs listed there](https://github.com/Neilpang/acme.sh/wiki/dnsapi) (includes all of the major providers like namecheap, goDaddy, etc.)
2. A server's IP address that you have root access to. You can use your home server or get one from [AWS EC2](https://aws.amazon.com/ec2/?hp=tile&so-exp=below), [DigitalOcean](https://www.digitalocean.com/), [GoogleCloud](https://cloud.google.com/), etc.

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

2. **AWS Users Only**  Change to root user `sudo su root` and change to home folder `cd ~`

2. Clone the app: `git clone https://github.com/garageScript/myProxy.git`

3. Go to the MyProxy folder: `cd myProxy`

4. Run the setup script `./scripts/setup.sh`
    This will installed require dependencies.
    * Installs `nodeJS` and `npm` if system does not have them.
    * Enables firewall port `3000` (for the admin page UI), `80` and `443`.
    * Installs application dependencies
    * For a complete list of things the script runs, [look here](https://github.com/garageScript/myProxy/blob/master/scripts/setup.sh)

5. Run the App: `ADMIN=YOUR_ADMIN_PASSWORD npm run server` 
> You can also run the app under your own defined port by setting a `PORT` environment variable

6. Exit from server `exit`

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

7. Update scripts section of `package.json` with `"start:myproxy": "node app.js"`
8. Run `git add .`
9. Run `git commit -m "Initial Commit"`
10. Run `git push origin master`

# API Reference

Users can use Access Tokens to manage their domain mappings from a 3rd part server.
[See available endpoints](https://github.com/garageScript/myProxy/wiki/API)

# Development
The following steps will guide you through how to setup your development environment to send pull requests or build your own custom features.

## Prerequisites
You need to install node and typescript

# Contribution
The following will show you how to contribute

## Before sending a Pull Request:
1. Run `npm run autofix`: make sure there are no errors / warnings
