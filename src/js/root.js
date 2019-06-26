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
import {getSessionId} from './selectors/common.js'
import Login from './markup/login/login.js'
import webGlId from './services/webGlId.js'
import Fingerprint from './services/fingerprint.js'
import {getUser} from './selectors/common.js'

i18n.use(locale);

class Root extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      fail: false 
    };

    window.claimMessageAdd = (typ,message)=>{
      const type = ({
        'E' : 'error',
        'I' : 'info',
        'W' : 'warning',
        'S' : 'success'
      })[typ] || typ;
      Notification[type]({message: message+''});
    };
  }

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

  componentDidCatch(error, info) {
    const fail = {error, info};
    this.setState({fail});
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
    const {fail} = this.state; 
    if (fail) {
      console.error('Fail:',fail);

      let stackTrace = [];
      try{
        stackTrace = fail.error.stack.replace(new RegExp('\r', 'g'),'\n',).split('\n');
      } catch(x){
      }

      return (
        <div>
          <div style={{marginTop: '40px',textAlign: 'center'}}>
            <h1 style={{ fontWeight: 'bold',fontSize: '20px', marginBottom: '20px', opacity: 0.75}}>Неудача.</h1>
          </div>
          <div style={{padding: '20px 20px 20px 60px', fontFamily: 'monospace'}}>
            <ul>
            {stackTrace.map((x,i)=><li key={i}>{x}</li>)}
            </ul>
          </div>
        </div>);
    }//

    const {externalLogin,loggedIn,sys} = this.props;

    if (loggedIn){
      if (!sys){
        // ?
      }
      return <App />;
    } else if (!externalLogin){
      return <Login />;
    }
    return <span>Авторизация...</span>;
  } //
};

export default connect((state) => {
   const loggedIn  = getSessionId(state);
   const externalLogin = state.getIn(['general','externalLogin']);
   const sys =state.getIn(['general','system']);
   return {loggedIn,externalLogin,sys};
})(Root);
