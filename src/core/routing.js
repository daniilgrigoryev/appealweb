import React from 'react'
import { BrowserRouter, Route, Switch, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import Login from '../markup/login/login.js'
import App from '../markup/app/app.js'
import { Notification } from 'element-react'
import { messagesErase } from '../actions/common.js'
import 'element-theme-default';

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
   const messagesQueue = state.get('messagesQueue').toJS();
   const loggedIn  = !!state.getIn(['user','sessionID']);
   return {loggedIn, messagesQueue};
})(Routing);