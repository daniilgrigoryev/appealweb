import { take, takeLeading, takeEvery, put, call, fork, select, all } from 'redux-saga/effects'
import * as actions from '../actions/common.js'
import { getUserData } from '../selectors/common.js'
import * as api from '../services/api.js'

const log = ()=>{} //(msg)=>console.log(msg)
const err = (err)=>console.error(err)

export function* watchLogin(action) {   
    log(' in watchLogin : action taken');
    try{
      const loggedData = yield call(api.login,action.loginData);
      log(' in watchLogin : logged');      
      let exc = 'Unknown login error';
      if (!loggedData || !loggedData.data || (exc=loggedData.data.error)) {
        throw exc;
      }
      yield put(actions.loginSuccess(loggedData.data));
    } catch (message){
        err(message);
        yield put(actions.messageSet(message,'error'));
    }
}

export function* watchLogout(action) {   
    try{
      const loggedData = yield call(api.logout,action.sessionId);      
      let exc = 'Unknown logout error';
      if (!loggedData || !loggedData.data || (exc=loggedData.data.error)) {
        throw exc;
      }
      yield put(actions.logoutSuccess());
    } catch (message){
        err(message);
        yield put(actions.messageSet(message,'error'));
    }
}

export default function* root() {
  yield all([
              takeLeading(actions.LOGIN_REQUEST, watchLogin),
              takeLeading(actions.LOGOUT_REQUEST, watchLogout)
            ])
}