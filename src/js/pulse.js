import * as API from './services/api.js'

let PULSE = null;

const TIMEOUT = 60*1000; // 60s => ms
const QUEUE = {};

const passer = (cb,count)=>{ 
	const CNT = Math.abs(count); 
	let i = count; 
	return ()=>{  
		if (!--i){   
			i=CNT; 
			cb();     
		}           
	}                            
}

const next = ()=>{
	stop();
	console.log('pulse tick')
	for (let key in QUEUE){
		try {
			QUEUE[key]();
		} catch (e){
			console.error('pulse [' +key+'] error: ',e);
		}
	}
	PULSE = setTimeout(next,TIMEOUT);	
}

const eventToogle = (alias,callback)=>((QUEUE[alias] ? eventOn : eventOff)(alias,callback));
const eventOn  = (alias,callback)=>(QUEUE[alias] = callback);
const eventOff = (alias,callback)=>(delete QUEUE[alias]);
	
export function notifyAlive(ident,externalSid){
	const alias = 'NOTIFY_ALIVE';
	const callback = passer(()=>API.notifyAlive(ident,externalSid),15);
	eventOn(alias,callback);	
}

export function stop(){
	if (PULSE){
		clearTimeout(PULSE);
		PULSE = null;	
	}	
}

export function start(){
	stop();
	next();
}