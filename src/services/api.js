import * as AJ from './ajax.js'

const MODE = 'DEV_47'

const URLS = {
	'DEV_152': 'https://172.20.255.152:8443/AppealAPI/',
	'DEV_47' : 'https://172.20.255.47:8443/AppealAPI/',
	'PROD'   : '/'
}


const BASE_URL = URLS[MODE];
AJ.setBase(BASE_URL)
AJ.setMode(MODE)

export function login(loginData){ 
	return AJ.post('rest/login',loginData);
}

export function logout(sessionId){
	return AJ.post('rest/logout',{sessionId});
}