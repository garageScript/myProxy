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

## How to add a new provider

Within this section we will guide you step by step on how to add a new provider that is supported by [acme.sh][DNS_API_integration].

For this exemple we will add the provider [**Name.com**][name.com]

### Looking at acme.sh documention

Take a look at the documentation [28. Use Name.com API][Use_Name.com]

  1. Create your API token here: https://www.name.com/account/settings/api

  2. They give us all **keys** and **dns_name** that we will use:

  ```bash
  export Namecom_Username="testuser"
  export Namecom_Token="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

  acme.sh --issue --dns dns_namecom -d example.com -d www.example.com
  ```

>Don't worry if you don't understand this bunch on code will we go through later on it

### Let's implement name.com on myProxy

You will find all implemented providers into `src/providers/index.ts`

You will find `providerList`, has you can see it's an array of object with each provider supported. (Ok right now we only have Go Daddy 🙂)

>To add a new provider please follow acme.sh naming convention

```js
export const providerList = [
  {
    name: 'GoDaddy', // Provider name
    dns: 'dns_gd', // dns_provider
    keys: ['GD_Key', 'GD_Secret'], // [PROVIDER_Key, ...etc]
    service: 'https://api.godaddy.com', // Provider API
    path: './goDaddy' // Relative path of the provider file in "./src"
  }
] as ProviderInfo[]
```

Let's code a bit and add name.com

1. You will find `dns_provider` name in this line:

`acme.sh --issue --dns dns_namecom -d example.com -d www.example.com`

2. You will find `keys` here:

```bash
  export Namecom_Username="testuser"
  export Namecom_Token="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

```js
export const providerList = [
  {
    name: 'GoDaddy', // Provider name
    dns: 'dns_gd', // dns_name for the provider
    keys: ['GD_Key', 'GD_Secret'], // Keys [PROVIDER_Key, ...etc]
    service: 'https://api.godaddy.com', // Provider API
    path: './goDaddy' // Relative path of the provider file in "./src"
  },
    },
+  {
+    name: 'Name.com',
+    dns: 'dns_namecom',
+    keys: ['Namecom_Username', 'Namecom_Token'],
+    service: 'https://api.name.com',
+    path: './namecom'
+  }
] as ProviderInfo[]
```

### Create the Typescript file

Now we will add the `namecom.ts` within `src/providers/namecom.ts`

Please you can rely on existing providers the logic will be the same.
Quick eplanation of the code.

Import your provider from `providerList`

```js
const provider = providerList.find(provider => provider.name === 'Name.com')
const { name, dns, keys, service } = provider
```

Will find and setup the provider keys `Namecom_Username` and `Namecom_Token`

```js
const getKeys = () => {...} ServiceKey[]
```

This method is **mandatory** and will return your domains

```js
export const getDomains = () => {...} Promise<Provider>
```

This method is **mandatory** and will setup your hostname record
> You have to setup two records the root domain and the wildstar for all your subdomains

```js
export const setRecord = async(args) => {...} Promise<ServiceResponse>
```

### Add the provider Type for Typscript

Your are almost done 🎉

Within `src/types/general.ts` add the type object than return the provider request in `getDomains`

```ts
type NamecomDomain = {
  domainName: string
  locked: boolean
  autorenewEnabled: boolean
  expireDate: string
  createDate: string
}

type RequestForName = {
  domains: NamecomDomain[] | []
}
```

Your done! get a beer 🍺

## Before sending a Pull Request

1. Run `npm run autofix`: make sure there are no errors / warnings

## License

myProxy is [MIT licensed](https://github.com/garageScript/myProxy/blob/master/LICENSE)

[DNS_API_integration]: https://github.com/Neilpang/acme.sh#8-automatic-dns-api-integration
[name.com]: https://www.name.com/
[Use_Name.com]: https://github.com/Neilpang/acme.sh/wiki/dnsapi#28-use-namecom-api