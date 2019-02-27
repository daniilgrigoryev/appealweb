import * as A from '../actions/common.js'
import Immutable from 'immutable'

const im = (obj)=> Immutable.fromJS(obj)


const addMessage = (state,type,message)=>{
	const list = state.get('messagesQueue').push(im({type,message}));
  	return state.set('messagesQueue',list);
}

const rootReducer = function(state, action){
  switch (action.type) {
  	case A.LOGOUT_DONE:
  		window.location.reload(); 
      //window.location = window.location; 
      return state;
  	case A.MESSAGES_ERASE:
      return state.set('messagesQueue',im([]));
  	case A.MESSAGE_SET:
  		return addMessage(state,action.severity,action.message)
  	case A.LOGIN_DONE:
  		return addMessage(state,'info','Вход...').set('user', im(action.loggedData));
    default: 
    	return state
  }
}

const initialState = Immutable.fromJS({
    general : {
      system: 'M',
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