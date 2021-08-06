## Agora Meeting



## Install  

```bash
# install all dependencies via lerna and npm
yarn bootstrap
```



## config

```bash
# copy config template to agora-rte-demo project
cp packages/agora-meeting-sdk/.env.example packages/agora-meeting-sdk/.env

# fill the config 
SKIP_PREFLIGHT_CHECK=true
REACT_APP_AGORA_APP_ID=<YOUR APP_ID>
REACT_APP_AGORA_APP_SDK_DOMAIN=https://api.agora.io
REACT_APP_AGORA_APP_CERTIFICATE=<YOUR APP_CERTIFICATE>
```



## run

```bash
yarn dev
```

