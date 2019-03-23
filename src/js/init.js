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

(()=>{
	const immutableReducer = combineReducers({general : rootReducer, form : formReducer })
	const sagaMiddleware = createSagaMiddleware()
	const store = createStore(immutableReducer, initialState, applyMiddleware(sagaMiddleware))
	sagaMiddleware.run(rootSaga)

	const el = document.getElementById('main');
	
	ReactDOM.render(
		<Provider store={store}>	
			<Root />
		</Provider>
	,el);//
})();