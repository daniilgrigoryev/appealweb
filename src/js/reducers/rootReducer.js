import * as A from '../actions/common.js'
import * as AJAX from '../services/ajax.js'
import * as PULSE from '../pulse.js'
import Immutable from 'immutable'

const im = (obj)=> Immutable.fromJS(obj)

const addMessage = (state,type,message)=>{
	const list = state.get('messagesQueue').push(im({type,message}));
  return state.set('messagesQueue',list);
}

const rootReducer = function(state, action){
  switch (action.type) {
  	case A.LOGOUT_DONE:
      PULSE.stop();
      AJAX.eraseSid();
      if (state.get('externalLogin')){
        window.close();
      } else {
        window.location.reload();   
      }
  		return state;
  	case A.MESSAGES_ERASE:
      return state.set('messagesQueue',im([]));
  	case A.MESSAGE_SET:
  		return addMessage(state,action.severity,action.message)
  	case A.LOGIN_DONE:
      const {sessionID,externalSid} = action.loggedData; debugger;
      AJAX.setSid(sessionID);
      PULSE.notifyAlive(sessionID,externalSid)
      PULSE.start()
  		return addMessage(state,'info','Вход...').set('user', im(action.loggedData));
    case A.APPEAL_LOAD:
      return state.setIn(['form','appeal'],action.data);
    default: 
    	return state
  }
}

const initialState = Immutable.fromJS({
    general : {
      system: 'M',
      externalLogin: false && true,
      messagesQueue: [],
      user : {
        username : 'aleksandrov',
        sessionId: ''
      }
    },
    form: {
    }
		//,   ...
});

export {initialState,rootReducer};