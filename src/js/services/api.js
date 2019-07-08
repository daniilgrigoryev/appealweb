import * as AJ from './ajax.js'

const MODE = DEV_MODE ? 'DEV_152' : ''

const URLS = {
	'DESIGN' : 'DESIGN',
	'DEV_152': 'https://172.20.255.152:8443/AppealAPI/',
	'DEV_47' : 'https://172.20.255.47:8443/AppealAPI/',
	'DEV_97' : 'http://172.20.255.97:8080/Appeal/'
}

const BASE_URL = URLS[MODE] || '';
AJ.setBase(BASE_URL)
AJ.setMode(MODE)

export function baseUrl(){
	return BASE_URL;
}

export function login(loginData){
	if (MODE=='DESIGN'){
		return new Promise((resolve)=>setTimeout(()=>resolve({data:{sessionID : 'a123',username : 'design'}}),1500))
	}
	return loginData.externalSid
		? AJ.post('externalLogin/getUserParams/'+loginData.externalSid,loginData)
		: AJ.post('root/login',loginData);
}

export function notifyAlive(sessionId,externalSid=false){
	if (MODE=='DESIGN'){
		return new Promise((resolve)=>setTimeout(()=>resolve({status:'ok'}),500))
	}
	return externalSid
		? AJ.post('externalLogin/checkSession/',{sessionId,externalSid})
		: AJ.post('root/notify',{sessionId});
}

export function logout(sessionId){
	if (MODE=='DESIGN'){
		return new Promise((resolve)=>setTimeout(()=>resolve({data:{status:200}}),1500))
	}
	return AJ.post('root/logout',{sessionId});
}

export function push(sessionId,alias,data,jsonMode=false){
	const dataJSON = typeof data=='string' ? data : JSON.stringify(data);
	return AJ.post('db/select',{sid:sessionId, alias,data:dataJSON,jsonMode});	
}

export function loadFile(file) { 
	return AJ.postFile('storage/push', file);
}

export function fetchAutocomplete(key,dataWhere){
	return fetchSelect(key,dataWhere);
}

export function fetchSelect(key,dataWhere){	
	return AJ.post("db/select",{alias : key, listValueField : 'value', dataWhere});
}