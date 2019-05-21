import { take, takeLeading, takeEvery, put, call, fork, select, all } from 'redux-saga/effects'
import * as actions from '../actions/common.js'
import * as api from '../services/api.js'

const err = (err)=>console.error(err)

export function* watchFileLoad(action) {
    try {
      yield put(actions.fileLoadStart()); 
      const loaded = yield call(api.loadFile, action.file); 
      let exc = "Can't load";
      if (!loaded) {
        throw exc;
      }
      yield put(actions.filledUpload(loaded));
    } catch (message){
        err(message);
        actions.messageSet(message,'error');
    }
}
