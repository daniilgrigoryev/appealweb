import './login.scss'

import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import webGlId from '../../services/webGlId.js'
import Fingerprint from '../../services/fingerprint.js'
import {loginRequest, loadRequest} from '../../actions/common.js'

class Login extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      username : '',
      password : '',
      db: 'PG.TEST',
      list: []
    }

    this.onInput = this.onInput.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  onInput(evt){
    const {id,value} = evt.target;
    this.setState({[id]:value});
  }

  onLogin(){
    const {username,password,db} = this.state;
    const loginData = {
      user: username,
      password,
      db,
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

  render (){
    const {username,password} = this.state; 
    return (
        <div className='loginWrap'>
          <div className="logo"></div>
          <div className="login-block">
              <h1>Login</h1>
              <input type="text"     placeholder="Username" id="username" onChange={this.onInput} value={username}  />
              <input type="password" placeholder="Password" id="password" onChange={this.onInput} value={password}  />
              <button type='button' onClick={this.onLogin}>Submit</button>
          </div>
        </div>
    ); //
  }
}; //

export default connect()(Login);
