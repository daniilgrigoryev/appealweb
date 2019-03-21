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

const getAc = (key,query)=>{
	return new Promise((resolve,reject)=>{
		try{
			const cached = cache[key]; 
			if (cached){
				cached.lastAccess = now();
				resolve(cached.data);
			} else {
				fetchAutocomplete(key,query).then(data=>{
					const lastAccess = now();
					cache[key] = {data,lastAccess};
					resolve(data);
				}).catch(reject);
			}
		} catch (exc){
			console.error(exc);
			reject(null);
		}
	});
}

const getAcNoCache = (key,query)=>{
	return fetchAutocomplete(key,query);
}

const getSl = (key)=>{
	return new Promise((resolve,reject)=>{
		try{
			const cached = cache[key]; 
			if (cached){
				resolve(cached.data);
			} else { 
				fetchSelect(key).then(data=>{
					const lastAccess = Number.MAX_VALUE;
					cache[key] = {data,lastAccess};
					resolve(data);
				}).catch(reject);
			}
		} catch (exc){
			console.error(exc);
			reject(null);
		}	
	});
}

const getValue = (listLoader,key,property)=>{
	return new Promise((resolve,reject)=>{
		const retCB = (data)=> _.chain(data.data || data).filter(x=>x.property==property).first().get('value').value() || '';
		listLoader(key).then((data=>resolve(retCB(data)))).catch(reject);
	});
}

const getAcValue = (key,property)=>{
	return getValue(getAc,key,property);
}

const getSlValue = (key,property)=>{
	return getValue(getSl,key,property);
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

export {getAc,getSl,getAcNoCache,getAcValue};