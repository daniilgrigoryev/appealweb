import * as A from '../actions/common.js'
import * as AJAX from '../services/ajax.js'
import * as PULSE from '../pulse.js'
import Immutable from 'immutable'

const im = (obj)=> Immutable.fromJS(obj)

const addMessage = (state,type,message)=>{
	const list = state.get('messagesQueue').push(im({type,message}));
  return state.set('messagesQueue',list);
}

const reduceLogout = (state,action)=>{
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
  const {sessionID,externalSid} = action.loggedData;
  AJAX.setSid(sessionID);
  PULSE.notifyAlive(sessionID,externalSid);
  PULSE.start();
  return addMessage(state,'info','Вход...').set('user', im(action.loggedData));
}

const reduceMessagesErase = (state,action)=>state.set('messagesQueue',im([]));
const reduceMessageSet    = (state,action)=>addMessage(state,action.severity,action.message);
const reduceAppealLoad    = (state,action)=>state.setIn(['form','appeal'],action.data);

const ROOT_ACTIONS = {
  [A.LOGOUT_DONE]    : reduceLogout,
  [A.MESSAGES_ERASE] : reduceMessagesErase,
  [A.MESSAGE_SET]    : reduceMessageSet,
  [A.LOGIN_DONE]     : reduceLogin,
  [A.APPEAL_LOAD]    : reduceAppealLoad
}

const rootReducer = function(state, action){
  const change = ROOT_ACTIONS[action.type];
  return change ? change(state,action) : state;
}

const initialState = im({
    general : {
      system: 'M',
      externalLogin: false && true,
      messagesQueue: [],
      user : {
        username : '',
        sessionId: ''
      }
    },
    form: {
    }
		//,   ...
});

export {initialState,rootReducer};