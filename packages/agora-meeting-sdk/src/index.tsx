import 'promise-polyfill/src/polyfill';
import ReactDOM from 'react-dom';
import { App } from '@/infra/monolithic/app';
import AgoraMeetingSDK from './infra/api';
import { GlobalStorage } from '@/infra/utils';

//@ts-ignore
import { stopReportingRuntimeErrors } from 'react-error-overlay';

// NOTE: 改方法仅在开发环境生效，所以在开发环境禁止。
if (process.env.NODE_ENV === 'development') {
  stopReportingRuntimeErrors(); // disables error overlays
}

// eslint-disable-next-line react-hooks/rules-of-hooks
GlobalStorage.useSessionStorage();
//@ts-ignore
window.AgoraMeetingSDK = AgoraMeetingSDK;

ReactDOM.render(
  <App
    appConfig={{
      agoraAppId: `${REACT_APP_AGORA_APP_ID}`,
      agoraNetlessAppId: `${REACT_APP_NETLESS_APP_ID}`,
      sdkDomain: `${REACT_APP_AGORA_APP_SDK_DOMAIN}`,
      enableLog: true,
      token: `${REACT_APP_AGORA_APP_RTM_TOKEN}`,
      rtmUid: '',
      recordUrl: `${REACT_APP_AGORA_APP_RECORD_URL}`,
    }}
  />,
  document.getElementById('root'),
);
