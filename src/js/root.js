import React from 'react'
import App from './markup/app/app.js'
import Login from './markup/login/login.js'
import { connect } from 'react-redux'
import { Notification } from 'element-react'
import { messagesErase } from './actions/common.js'
import 'element-theme-default';
import { i18n } from 'element-react'
import locale from 'element-react/src/locale/lang/ru-RU'
import {getSessionId,getMessages} from './selectors/common.js'
import '../scss/index.scss'

import AppealWizard from './markup/appeal/appealWizard.js'
import ListTest from './markup/editable/listTest.js'
import FabulasList from './markup/editable/fabulasList.js'
import TipDocList from './markup/editable/tipDocList.js'
import Outgoing from './markup/outgoing/outgoing.js'

i18n.use(locale);

class Root extends React.Component  {

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
    setTimeout(this.checkMessages.bind(this),0);

    if (true){
      //return <AppealWizard />
      //return <Outgoing/>;
      //return <ListTest />
      //return <FabulasList/>;
      //return <TipDocList />
    }

    return !this.props.loggedIn ? <Login /> : <App />; //
  }
};

export default connect((state) => { //;
   const messagesQueue = getMessages(state).toJS();
   const loggedIn  = getSessionId(state);
   return {loggedIn, messagesQueue};
})(Root);