import './login.scss'

import {loginRequest} from '../../actions/common.js'
import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {post,get} from '../../services/ajax.js'
import Fingerprint from '../../services/fingerprint.js'
import webGlId from '../../services/webGlId.js'
import {getUser} from '../../selectors/common.js'

class Login extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      username : 'aleksandrov',
      password : '',
      db: 'PG.TEST',
      list: []
    }

    this.onInput = this.onInput.bind(this);
    this.onLogin = this.onLogin.bind(this);
  }

  componentDidMount(){
    /*post('https://172.20.255.47:8443/AppealAPI/rest/db_list',this.state).then((resp)=>{
      const arr = resp.data;
      if (!_.size(arr)){
        return;
      }
      const db = arr[0].key;
      const list = _.reduce(arr,(memo,it)=>(memo[it.key]=it.val,memo),{});
      //debugger;
    });*/
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


  loadDocx(e){
    const myHeaders = new Headers();
    myHeaders.append('Access-Control-Allow-Origin',"*");

    const file = e.target.files[0];
    const formData = new FormData();
    let filename;
    let warn;

    formData.append('file', file);

    fetch('https://127.0.0.1:8443/AppealAPI/rest/load_docx', {
          method: 'POST',
          headers: myHeaders,
          mode: 'cors',
          cache: 'no-cache',
          body: formData
    }).then(res => {
          filename = (res.headers.get("Content-Type") || "").replace("attachment; filename=","");
          filename = decodeURI(filename);
          warn = decodeURI(res.headers.get("Content-Language"));
          console.log(warn)
          return res.blob();
    }).then(res => { 
          const data = new Blob([res], {type: 'application/octet-stream'});
          const answ = window.URL.createObjectURL(data);
          var tempLink = document.createElement('a');
          tempLink.href = answ;
          tempLink.setAttribute('download', filename);
          tempLink.click();

          setTimeout(()=>{
            tempLink && (tempLink.remove());
          },5000);
        });
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
              <button onClick={this.onLogin}>Submit</button>
              <input type="file" name="file" onChange={this.loadDocx} />
          </div>
        </div>
    ); //
  }
}; //

export default connect((state) => {
    return getUser(state).toJS();
})(Login);
