import ReactDOM from 'react-dom';
import { App } from '@/infra/monolithic/app';
import AgoraMeetingSDK from './infra/api';
import { GlobalStorage } from '@/infra/storage';



// eslint-disable-next-line react-hooks/rules-of-hooks
GlobalStorage.useSessionStorage();
//@ts-ignore
window.AgoraMeetingSDK = AgoraMeetingSDK;

ReactDOM.render(<App />, document.getElementById('root'));
