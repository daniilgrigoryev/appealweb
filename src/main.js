import React from 'react'
import ReactDOM from 'react-dom'
import Routing from './core/routing.js'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import {combineReducers} from 'redux-immutable'
import createSagaMiddleware from 'redux-saga'
import {initialState,rootReducer} from './reducers/root.js'
import rootSaga from './sagas/root.js'
import Immutable from 'immutable'

(()=>{
	//const immutableReducer = combineReducers({rootReducer});
	const sagaMiddleware = createSagaMiddleware()
	const store = createStore(rootReducer, initialState, applyMiddleware(sagaMiddleware))
	sagaMiddleware.run(rootSaga)

	const el = document.getElementById('main');
	
	ReactDOM.render(
		<Provider store={store}>	
			<Routing />
		</Provider>
	,el);//
})();