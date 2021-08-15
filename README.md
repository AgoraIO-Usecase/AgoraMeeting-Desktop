# Agora Meeting



## **First**

Install deps from project root `yarn` or `npm i`



## Run Demo



### Change Config

enter packages/agora-apaas-demo/src/components/app/index.js

input your appId and appCertificate



### Start Development

from project root

```
yarn run run:apaas or npm run run:apaas
```



## Run Meeting-sdk



### Change Config

enter packages/agora-meeting-sdk

rename `.env.example`  to  `.env` , and configure the following parameters.

```bash
SKIP_PREFLIGHT_CHECK=true
REACT_APP_AGORA_APP_ID=<YOUR APP_ID>
REACT_APP_AGORA_APP_SDK_DOMAIN=https://api.agora.io
REACT_APP_AGORA_APP_CERTIFICATE=<YOUR APP_CERTIFICATE>
REACT_APP_AGORA_APP_RECORD_URL=<YOUR RECORD_URL>
```







### Start Development

from project root

```
yarn run run:demo or npm run run:demo
```

