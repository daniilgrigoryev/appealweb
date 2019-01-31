import React from 'react'
import { connect } from 'react-redux'
import Login from '../markup/login/login.js'
import App from '../markup/app/app.js'
import { Notification } from 'element-react'
import { messagesErase } from '../actions/common.js'
import 'element-theme-default';
import {getSessionId,getMessages} from '../selectors/common.js'

class Routing  extends React.Component  {

  checkMessages(){
    const messages = this.props.messagesQueue;
    if (messages && messages.length){
      try{
        messages.forEach(m=>{
          const {type,message} = m; //types: info,success,warning,error
          Notification[type]({message: message+''});
        });
      } finally {
        this.props.dispatch(messagesErase());
      }
    }
  }

  render (){ 
    setTimeout(this.checkMessages.bind(this),0)
    return !this.props.loggedIn ? <Login /> : <App />; //
  }
};

export default connect((state) => {
   const messagesQueue = getMessages(state).toJS();
   const loggedIn  = getSessionId(state);
   return {loggedIn, messagesQueue};
})(Routing);