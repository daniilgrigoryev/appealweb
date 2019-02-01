import {fetchAutocomplete,fetchSelect} from './api.js'

const expires = 1000*60*5; // 5 mins

const cache = {
	/*
	key : {
		data: [
				{
					value: 'видимый текст',
					property : 'property'	
				}
			],
		lastAccess : 000
	}
	*/
}

const now = ()=> new Date().getTime();

const getAc = (getCallback,key,query)=>{
	const cached = cache[key]; 
	if (cached){
		cached.lastAccess = now();
		getCallback(cached.data);
		return;
	} 
	fetchAutocomplete(key,query).then(data=>{
		const lastAccess = now();
		cache[key] = {data,lastAccess};
		getCallback(data);
	});
}


const getAcNoCache = (getCallback,key,query)=>{
	fetchAutocomplete(key,query).then(getCallback);
}

const getSl = (getCallback,key)=>{
	const cached = cache[key]; 
	if (cached){
		getCallback(cached.data);
		return;
	} 
	fetchSelect(key).then(data=>{
		const lastAccess = Number.MAX_VALUE;
		cache[key] = {data,lastAccess};
		getCallback(data);
	});
}

const cleaner = ()=>{
	const n = now();
	for (let key in cache){
		if (n-cache[key].lastAccess>expires){
			delete cache[key];
		}
	}
}

const tickRate = 120; // seconds
const timer = setInterval(cleaner,1000*tickRate)

export {getAc,getSl,getAcNoCache};