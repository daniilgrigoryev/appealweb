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

export function fetchAutocomplete(key,query){
	return new Promise((resolve,reject)=>{
		const resp = [
		  { "value": "vue", 		"property": "https://github.com/vuejs/vue" },
	      { "value": "element", 	"property": "https://github.com/ElemeFE/element" },
	      { "value": "cooking", 	"property": "https://github.com/ElemeFE/cooking" },
	      { "value": "mint-ui", 	"property": "https://github.com/ElemeFE/mint-ui" },
	      { "value": "vuex", 		"property": "https://github.com/vuejs/vuex" },
	      { "value": "vue-router", 	"property": "https://github.com/vuejs/vue-router" },
	      { "value": "babel", 		"property": "https://github.com/babel/babel" }
		]
		setTimeout(()=>{
			resolve(resp);
		},100);
	});
}

export function fetchSelect(key){
	return new Promise((resolve,reject)=>{
		const resp = [
		  { "value": "Svue", 		"property": "Shttps://github.com/vuejs/vue" },
	      { "value": "Selement", 	"property": "Shttps://github.com/ElemeFE/element" },
	      { "value": "Scooking", 	"property": "Shttps://github.com/ElemeFE/cooking" },
	      { "value": "Smint-ui", 	"property": "Shttps://github.com/ElemeFE/mint-ui" },
	      { "value": "Svuex", 		"property": "Shttps://github.com/vuejs/vuex" },
	      { "value": "Svue-router", "property": "Shttps://github.com/vuejs/vue-router" },
	      { "value": "Sbabel", 		"property": "Shttps://github.com/babel/babel" }
		]
		setTimeout(()=>{
			resolve(resp);
		},100);
	});
}