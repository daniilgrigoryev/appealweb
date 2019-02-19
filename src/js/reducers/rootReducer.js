import * as A from '../actions/common.js'
import Immutable from 'immutable'
import {out} from '../services/ajax.js'

const im = (obj)=> Immutable.fromJS(obj)


const addMessage = (state,type,message)=>{
	const list = state.get('messagesQueue').push(im({type,message}));
  	return state.set('messagesQueue',list);
}

const rootReducer = function(state, action){
  switch (action.type) {
  	case A.LOGOUT_DONE:
  		window.location = window.location; 
      return state;
  	case A.MESSAGES_ERASE:
      return state.set('messagesQueue',im([]));
  	case A.MESSAGE_SET:
  		return addMessage(state,action.severity,action.message)
  	case A.LOGIN_DONE:
  		return addMessage(state,'info','Вход...').set('user', im(action.loggedData));
    case A.FILLED_UPLOAD:
      let rs = out(action.file);
      if (rs) {
        return addMessage(state, 'warning', 'Некорректно:\n' + rs.split('**').join('\n'));
      }
    default: 
    	return state
  }
}

const initialState = Immutable.fromJS({
    general : {
      messagesQueue: [],
      user : {
        username : '',
        sessionId: ''
      }
    },
    form: {
      appeal : {}
    }
		//,   ...
});

export {initialState,rootReducer};