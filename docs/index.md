# MyProxy &middot; [![CircleCI](https://circleci.com/gh/garageScript/myProxy.svg?style=svg)](https://circleci.com/gh/garageScript/myproxy)
MyProxy is an application that:
* Helps you connect to your Domain provider
* Setup A and CNAME records for your selected domain
* Create and serve SSL certificates for your selected domains
* Run an unlimited number of applications on your subdomains.

## Why?
Setting up a server is hard, especially setting up DNS records, managing certificates, and deployment. So we setup to build a simple and usable app that helps us build applications quickly.   

We are new to software engineering so if you find areas where this app could be improved, please let us know by [creating an issue](https://github.com/garageScript/myproxy/issues). We are excited to learn!  

Also, we are currently looking for a job. If your team needs software engineers, please hire us:
* [Alberto Lopez](https://www.linkedin.com/in/albertolopez-siliconvalley/) - Available immediately
* [David De Wulf](https://dewulfdavid.com) - Open to new opportunities
* [Rahul Kalra](https://www.linkedin.com/in/voterknow) - Available immediately
* [Sahil Kalra](https://www.linkedin.com/in/s1kalra/) - UC San Diego senior, graduating June 2020

## Prerequisites
To use `MyProxy`, you need 2 things:
1. A domain name. MyProxy uses [acme.sh](https://github.com/Neilpang/acme.sh/wiki/dnsapi), so you would have to buy the domains from any of the [DNS APIs listed there](https://github.com/Neilpang/acme.sh/wiki/dnsapi) (includes all of the major providers like namecheap, goDaddy, etc.)
2. A server's IP address that you have root access to. You can use your home server or get one from [AWS EC2](https://aws.amazon.com/ec2/?hp=tile&so-exp=below), [DigitalOcean](https://www.digitalocean.com/), [GoogleCloud](https://cloud.google.com/), etc.

## How To Use
SSH into your server. ie (`ssh root@your-server-ip-address`)  

Run `ADMIN=YOUR_ADMIN_PASSWORD npm run server`. You will have to run this as `root` or use `sudo`. This will install required dependencies and start the server.
* Installs `git` if system does not have it.
* Installs `nodeJS` and `npm` if system does not have it.
* Enable firewall port `3000` (for the admin page UI), `80` and `443`.
* Installs application dependencies
* For a list of things the script runs, [look here](https://github.com/garageScript/myProxy/blob/master/scripts/setup.sh)  

Exit from server `exit`

Go to your server url: `http://your-server-ip-address:3000`. You will be prompted to put in your domain provider's API Key and Secret, [find out how here](https://github.com/Neilpang/acme.sh/wiki/dnsapi)

All your domain names in that provider will show up. Click the `setup` button next to the domain you wish to setup (could take up to 3 minutes)

After your domain is setup, you will be able to generate as many subdomain repository as you want! To do that:
1. Go to your server url:  `http://your-server-ip-address:3000`
2. Create a subdomain. Ip and port are optional. You should see a git link that was created for you.
3. `git clone` the app, then build the app locally.
4. When you are done, `git push origin master` and watch your app run in production!

# Development
The following steps will guide you through how to setup your development environment to send pull requests or build your own custom features.

## Prerequisites
You need to install node and typescript

## Running the app
1. First install dependencies: `npm install` or `yarn`
2. Run the app: `yarn start` or `npm run start`
> You can also run the app under your own defined port by setting a `PORT` environment variable

# Contribution
The following will show you how to contribute

## Before sending a Pull Request:
1. Run `npm run autofix`: make sure there are no errors / warnings
