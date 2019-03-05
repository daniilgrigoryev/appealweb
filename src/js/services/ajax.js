import axios from 'axios'

let MODE = '';
let BASE_URL = '';
let sessionId = null;

const ajax = (method,url,payload,ajaxOpts) => {
	let opts = {
	  method:method,
	  url:BASE_URL+url,
	  data: {}
	}

	opts.headers =  {
       	'Accept':       'application/json',
       	'Content-Type': 'application/json'//;charset=UTF-8',
    }

    if (sessionId){
    	opts.data.sessionId = sessionId;
    }

	if (MODE && MODE.indexOf('DEV')==0 ){ // mode starts with dev - CORS enabled
		opts.headers['Access-Control-Allow-Origin']="*";
	}	

	if (payload){
		(typeof payload == 'function') && (payload = payload());
		(typeof payload == 'object')   && (Object.assign(opts.data,payload));
	}

	if (ajaxOpts){
		(typeof ajaxOpts == 'function') && (ajaxOpts = ajaxOpts());
		(typeof ajaxOpts == 'object')   && (Object.assign(opts,ajaxOpts,{method,url,data}));
	}

	if (method=='GET'){
		opts.params = opts.data;
	} else {
		opts.data = JSON.stringify(opts.data);
	}
	
	return new Promise((resolve, reject)=>axios(opts).then(resolve).catch(reject));
}

const	get      = (url,payload,ajaxOpts)=> ajax('GET',url,payload,ajaxOpts);
const	post     = (url,payload,ajaxOpts)=> ajax('POST',url,payload,ajaxOpts);
const	del      = (url,payload,ajaxOpts)=> ajax('DELETE',url,payload,ajaxOpts);
const	put      = (url,payload,ajaxOpts)=> ajax('PUT',url,payload,ajaxOpts);

const	setBase  = (newBase)=>{ BASE_URL = newBase; }
const   setMode  = (newMode)=>{ MODE = newMode;}
const	setSid   = (newSid) =>{ sessionId = newSid;}
const	eraseSid = ()=>{ sessionId = null; }

export {setBase,setMode,setSid,eraseSid,get,post,del,put};
