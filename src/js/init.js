import React from 'react'
import ReactDOM from 'react-dom'
import Root from './root.js'
import { reducer as formReducer } from 'redux-form/immutable'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import {combineReducers} from 'redux-immutable'
import createSagaMiddleware from 'redux-saga'
import {initialState,rootReducer} from './reducers/rootReducer.js'
import rootSaga from './sagas/rootSaga.js'
import loadSagas from './sagas/loadSagas.js'
import Immutable from 'immutable'
import {setSid} from './services/ajax.js'

const stateLoad = (key) => {
	try {
	   	const serializedState = localStorage.getItem(key);
      	localStorage.removeItem(key);
	    if (serializedState) {
	    	return JSON.parse(serializedState);
	    }
	  } catch (err) {	 
	  }
	  return undefined;
}; 


const externalState = ()=>{
	const MRK = '&storageKey=';
    const {hash} = window.location;

    try{
	    let sindex;
	    if ((sindex=hash.indexOf(MRK))!=-1){
	      const k = hash.substr(sindex+MRK.length);
	      if (k && k.length){
	      	const key = 'state'+k; 
	        window.location.hash = hash.substr(0,sindex);
	        const stateStr = stateLoad(key);
	        if (stateStr){
	        	setSid(_.get(stateStr, ['general','user','sessionID']));
	        	return Immutable.fromJS(stateStr);
	        }
	      }
	    }
	} catch(exc){
	}
    return null;
}


(()=>{
	const immutableReducer = combineReducers({general : rootReducer, form : formReducer })
	const sagaMiddleware = createSagaMiddleware()
	const store = createStore(immutableReducer, externalState() || initialState, applyMiddleware(sagaMiddleware))
	sagaMiddleware.run(rootSaga)

	const el = document.getElementById('main');
	

	window.stateSave = () => {
		try {
			const state = store.getState();
			const serializedState = JSON.stringify(state);
		    const key = Math.ceil(Math.random()*10000-2)+1;
		    localStorage.setItem('state'+key, serializedState);
			return key;
		} catch (err){
			return false;
		}
	};

	ReactDOM.render(
		<Provider store={store}>	
			<Root />
		</Provider>
	,el);//
})();