import * as AJ from './ajax.js'

const MODE = 'DEV_47'

const URLS = {
	'DESIGN' : 'DESIGN',
	'DEV_152': 'https://172.20.255.152:8443/AppealAPI/',
	'DEV_47' : 'https://172.20.255.47:8443/AppealAPI/'
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
	return AJ.post('db/push',{sid:sessionId, alias,data:dataJSON,jsonMode});	
}

export function loadFile(file) { 
	return AJ.postFile('doc/load_docx', file);
}

export function fetchAutocomplete(key,query){
	return fetchSelect(key);
}

export function fetchSelect(key){
	switch(key){
		case 'fabulasCategories': return fetchFabulasCategories();
		case 'decision_regional_court': return fetchDecisionsRegionalCourt(); 
		case 'decision_moscow_court':   return fetchDecisionsMoscowCourt();
		default: return AJ.post("db/select",{alias : key, listValueField : 'value'});
	}
}


export function fetchDecisionsRegionalCourt(){
	return new Promise((resolve,reject)=>{
		const resp =[
			"постановление оставлено без изменения, жалоба не удовлетворена",
			"постановление отменено, прекращено производство по делу",
			"постановление отменено, дело возвращено на новое рассмотрение"
		];
		setTimeout(()=>resolve(resp),10);
	});	
}

export function fetchDecisionsMoscowCourt(){
	return new Promise((resolve,reject)=>{
		const resp = [
			"МАДИ",
			"заявитель"
		];
		setTimeout(()=>resolve(resp),10);
	});	
}

export function fetchFabulasCategories(){
	return new Promise((resolve,reject)=>{
		const resp =[];
		const size = Math.floor(Math.random()*4);

		for (let i=0;i<size;i++){
			const id = i;
			const label = 'Категория ' + i;
			resp.push({id,label});
		}

		setTimeout(()=>resolve(resp),10);
	});		
}