import { take, takeLeading, takeEvery, put, call, fork, select, all } from 'redux-saga/effects'
import * as actions from '../actions/common.js'
import { getUserData } from '../selectors/common.js'
import * as api from '../services/api.js'

const log = (msg)=>console.log(msg)
const err = (err)=>console.error(err)

export function* watchAutocomplete(action) {   
    log(' in watchAutocomplete : action taken');
    try{
      const key = action.key;
      const loggedData = yield call(api.login,{key}); 
      log(' in watchAutocomplete : logged');      
      let exc = 'Unknown autocomplete error';
      if (!loggedData || !loggedData.data || (exc=loggedData.data.error)) {
        throw exc;
      }
      actions.loginSuccess(loggedData.data);
    } catch (message){
        err(message);
        actions.messageSet(message,'error');
    }
}