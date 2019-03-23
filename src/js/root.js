import 'element-theme-default';
import '../scss/assembly.scss'
import '../scss/index.scss'

import React from 'react'
import App from './markup/app/app.js'
import { connect } from 'react-redux'
import { Notification } from 'element-react'
import { messagesErase } from './actions/common.js'
import {loginRequest} from './actions/common.js'
import { i18n } from 'element-react'
import locale from 'element-react/src/locale/lang/ru-RU'
import {getSessionId,getMessages} from './selectors/common.js'
import Login from './markup/login/login.js'
import AppealWizard from './markup/appeal/appealWizard.js'
import ListTest from './markup/editable/listTest.js'
import FabulasList from './markup/editable/fabulasList.js'
import TipDocList from './markup/editable/tipDocList.js'
import Outgoing from './markup/outgoing/outgoing.js'
import DocLinker from './markup/outgoing/subForms/docLinker.js'
import IncomingLetter from './markup/letter/inc/incomingLetter.js'
import OutcomingLetter from './markup/letter/out/outcomingLetter.js'
import  DiapSPI  from './markup/settings/diapSPI.js'
import  Postage  from './markup/settings/postage.js'
import webGlId from './services/webGlId.js'
import Fingerprint from './services/fingerprint.js'
import {getUser} from './selectors/common.js'

i18n.use(locale);

class Root extends React.Component {

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

//http://172.20.255.47:8081/#sid=90c9d985-a5bf-43cb-af74-24382d9efdcd

  componentDidMount(){
    const MRK = 'sid=';
    const {hash} = window.location;

    let sindex;
    if ((sindex=hash.indexOf(MRK))!=-1){
      const sid = hash.substr(sindex+MRK.length);
      if (sid && sid.length){
        window.location.hash = '';
        setTimeout(()=>this.doExternalLogin(sid),5);
      }
    }
  }

  doExternalLogin(sid){
    const loginData = {
      externalSid: sid,
      version: '0',
      version_date: '0',
      sfp: new Fingerprint().get(),
      wgl: webGlId(),
      platform  : navigator.platform,
      useragent : navigator.userAgent,
      cookie : navigator.cookieEnabled
    };

    this.props.dispatch(loginRequest(loginData));
  }


  render(){
    setTimeout(this.checkMessages.bind(this),0);

    if (true){
      //return <Postage />
      //return <IncomingLetter/>;
      //return <DocLinker />
      //return <AppealWizard />

      //return <Outgoing/>;
      //return <ListTest />
      //return <FabulasList/>;
      //return <TipDocList />
    }

    const {externalLogin,loggedIn} = this.props;

    if (loggedIn){
      return (<App />);
    } else if (!externalLogin){
      return (<Login />);
    }
    return (<span>Нет.</span>);
  } //
};

export default connect((state) => { //;
   const messagesQueue = getMessages(state).toJS();
   const loggedIn  = getSessionId(state);
   const externalLogin = state.getIn(['general','externalLogin']);
   return {loggedIn, messagesQueue, externalLogin};
})(Root);