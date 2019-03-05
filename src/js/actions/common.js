export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_DONE = 'LOGIN_DONE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_DONE = 'LOGOUT_DONE'

export const GET_ALL_APPEALS = 'GET_ALL_APPEALS'
export const MESSAGE_SET   = 'MESSAGE_SET'
export const MESSAGES_ERASE = 'MESSAGES_ERASE'

export const APPEAL_LOAD = 'APPEAL_LOAD';

export function messageSet(message, severity){
	return {type: MESSAGE_SET, message, severity}
}

export function messagesErase(){
	return {type: MESSAGES_ERASE }
}

export function loginRequest(loginData){
	return {type: LOGIN_REQUEST, loginData}
}

export function loginSuccess(loggedData){ /* loginSuccess action generator */
	return {type: LOGIN_DONE, loggedData }
}

export function logoutRequest(sessionId){
	return {type: LOGOUT_REQUEST, sessionId} 
}

export function logoutSuccess(){
	return {type: LOGOUT_DONE }	
}

export function appealLoad(data){
	return {type: APPEAL_LOAD,data}
}