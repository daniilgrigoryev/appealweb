import * as AJ from './ajax.js'

const MODE = 'DEV_47'

const URLS = {
	'DESIGN' : 'DESIGN',
	'DEV_152': 'https://172.20.255.152:8443/AppealAPI/',
	'DEV_47' : 'https://localhost:8443/AppealAPI/'
	//'DEV_47' : 'https://172.20.255.47:8443/AppealAPI/'
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
		: AJ.post('rest/login',loginData);
}

export function notifyAlive(sessionId,externalSid=false){
	if (MODE=='DESIGN'){
		return new Promise((resolve)=>setTimeout(()=>resolve({status:'ok'}),500))
	}
	return externalSid
		? AJ.post('externalLogin/checkSession/',{sessionId,externalSid})
		: AJ.post('rest/notify',{sessionId});
}

export function logout(sessionId){
	if (MODE=='DESIGN'){
		return new Promise((resolve)=>setTimeout(()=>resolve({data:{status:200}}),1500))
	}
	return AJ.post('rest/logout',{sessionId});
}

export function push(sessionId,alias,data,jsonMode=false){
	const dataJSON = typeof data=='string' ? data : JSON.stringify(data);
	return AJ.post('rest/push',{sid:sessionId, alias,data:dataJSON,jsonMode});	
}

export function loadFile(file) { 
	return AJ.postFile('rest/load_docx', file);
}

export function fetchAutocomplete(key,query){
	return fetchSelect(key);
}

export function fetchSelect(key){
	switch(key){
		case 'fabulasDoc': 	  return fetchFabulasDoc();
		case 'fabulasCategories': return fetchFabulasCategories();
		case 'decision_regional_court': return fetchDecisionsRegionalCourt(); 
		case 'decision_moscow_court':   return fetchDecisionsMoscowCourt();
		default: return AJ.post("rest/selectList",{alias : key, listValueField : 'value'});
	}
}

export function fetchFabulasDoc(){
	return new Promise((resolve,reject)=>{
		const resp =[
			{id:1,label:'Сопроводительное письмо - ЮЛ без шапки',type:'Сопроводительное письмо'},
			{id:2,label:'Сопроводительное письмо - ФЛ без шапки',type:'Сопроводительное письмо'},
			{id:3,label:'Определение об отказе в расследовании 8.25 физ. лицо',type:'Определение'},
			{id:4,label:'Письмо гражданину Эвакуация 3.27 Привлечение к адм.ответств',type:'Сопроводительное письмо'},
			{id:5,label:'Определение_отказ_такси',type:'Универсальный'},
			{id:6,label:'Сопроводительное письмо - ФЛ - такси',type:'Сопроводительное письмо'},
			{id:7,label:'Сопроводительное письмо - ЮЛ (УКИП)',type:'Сопроводительное письмо'},
			{id:8,label:'Сопроводительное письмо - ЮЛ без шапки (УКИП)',type:'Сопроводительное письмо'},
			{id:9,label:'Сопроводительное письмо - ФЛ (УКИП)',type:'Сопроводительное письмо'},
			{id:10,label:'Уведомление_пропуск срока_8.25 (ФЛ)',type:'Решение'},
			{id:11,label:'Решение 8.25 ФЛ_ФФ',type:'Решение'},
			{id:12,label:'Уведомление_НЛ_Матвеев 8.25',type:'Решение'},
			{id:13,label:'Определение_срок_8.25 Матвеев_ЮЛ',type:'Решение'},
			{id:14,label:'Определение_срок_8.25 Матвеев_ФЛ',type:'Решение'},
			{id:15,label:'Решение 8.25 ЮЛ_ФФ',type:'Решение'},
			{id:16,label:'Такси_физ',type:'Решение'},
			{id:17,label:'Такси',type:'Решение'},
			{id:18,label:'Сопроводительное письмо - ФЛ',type:'Сопроводительное письмо'},
			{id:19,label:'Сопроводительное письмо - ЮЛ',type:'Сопроводительное письмо'},
			{id:20,label:'Сопроводительное письмо УРДиО (ЭЦП)',type:'Сопроводительное письмо'},
			{id:21,label:'Сопроводительное письмо - ФЛ без шапки (УКИП)',type:'Сопроводительное письмо'},
			{id:22,label:'Сопроводительное письмо - ФЛ угловой бланк',type:'Сопроводительное письмо'},
			{id:23,label:'Перенаправление_ФЛ',type:'Перенаправление'},
			{id:24,label:'Решение - ФЛ_Эвакуация',type:'Решение'},
			{id:25,label:'Уведомление об отказе НЛ ФЛ ЭВ',type:'Решение'},
			{id:26,label:'Определение_пропуск_срока_ФЛ',type:'Решение'},
			{id:27,label:'Определение об отказе в возбуждении (пункт 7)',type:'Решение'},
			{id:28,label:'Определение об отказе в возбуждении (пункт 7) ЮЛ',type:'Решение'},
			{id:29,label:'Отказ в возбуждении дела по срокам ЮЛ',type:'Решение'},
			{id:30,label:'Решение-ЮЛ_Фотофиксация',type:'Решение'},
			{id:31,label:'Уведомление_ПРОПУСК СРОКА_ЮЛ',type:'Решение'},
			{id:32,label:'Отказ в возбуждении дела по срокам',type:'Решение'},
			{id:33,label:'Уведомление об отказе НЛ ФЛ',type:'Решение'},
			{id:34,label:'Определение_пропуск_срока_ЮЛ',type:'Решение'},
			{id:35,label:'Решение - ФЛ_Фотофиксация',type:'Решение'},
			{id:36,label:'Уведомление_ПРОПУСК СРОКА_ФЛ',type:'Решение'},
			{id:37,label:'Извещение о явке ФЛ',type:'Извещение о явке'}
		];
		setTimeout(()=>resolve(resp),10);
	});	
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