import * as A from '../actions/common.js'
import * as AJAX from '../services/ajax.js'
import * as PULSE from '../pulse.js'
import Immutable from 'immutable'
import {out} from '../services/ajax.js'
import {relocate} from '../markup/app/app.js'

const im = (obj)=> Immutable.fromJS(obj);

const VERSION_FE = '15';
let VERSION_BE = null;
let VERSION_DB = null;
AJAX.get('root/version').then(x=>VERSION_BE=(''+x.data));

const getVersion = ()=>{
  return {
    backend:  VERSION_BE,
    frontend: VERSION_FE,
    database: VERSION_DB
  }
}

const reduceLogout = (state,action)=>{
  VERSION_DB = null;
  PULSE.stop();
  AJAX.eraseSid();
  if (state.get('externalLogin')){
    window.close();
  } else {
    window.location.reload();
  }
  return state
}

const reduceLogin = (state,action)=>{
  const {sessionID,externalSid,db_version,sys} = action.loggedData;
  VERSION_DB = db_version;
  AJAX.setSid(sessionID);
  PULSE.notifyAlive(sessionID,externalSid);
  PULSE.start();
  setTimeout(()=>relocate('explore'),100);
  window.claimMessageAdd('info','Вход...');
  return state.set('system',sys).set('user', im(action.loggedData));
}

const reduceAppealLoad = (state,action)=>state.setIn(['form','appeal'],action.data);

const ROOT_ACTIONS = {
  [A.LOGOUT_DONE] : reduceLogout,
  [A.LOGIN_DONE]  : reduceLogin,
  [A.APPEAL_LOAD] : reduceAppealLoad
}

const rootReducer = (state, action)=>{
  const change = ROOT_ACTIONS[action.type];
  return change ? change(state,action) : state;
}

const initialState = im({
    general : {
      system: '',
      externalLogin: true,

      user : {
        username : '',
        sessionId: ''
      }
    },
    form: {
    }
		//,   ...
});

export {initialState,rootReducer,getVersion};