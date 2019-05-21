export const LOGIN_REQUEST = 'LOGIN_REQUEST'
export const LOGIN_DONE = 'LOGIN_DONE'
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST'
export const LOGOUT_DONE = 'LOGOUT_DONE'

export const GET_ALL_APPEALS = 'GET_ALL_APPEALS'

export const APPEAL_LOAD = 'APPEAL_LOAD';
export const FILE_LOAD_START = 'FILE_LOAD_START';
export const FILLED_UPLOAD = 'FILLED_UPLOAD';
export const LOAD_REQUEST = 'LOAD_REQUEST';


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

export function fileLoadStart() {
	return {type: FILE_LOAD_START}
}

export function filledUpload(file) {
	return {type: FILLED_UPLOAD, file}
}

export function loadRequest(file) {
	return {type: LOAD_REQUEST, file}
}

export function messageSet(message,type){ // ! reverse order
	window.claimMessageAdd(type,message);
}