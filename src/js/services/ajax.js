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
		(typeof ajaxOpts == 'object')   && (Object.assign(opts,ajaxOpts,{method,url,data: opts.data}));
	}

	if (method=='GET'){
		opts.params = opts.data;
	} else if (method=='POST_FILE'){
		const data = new FormData();
		if (!payload.file){
			data.append("file", payload);
		} else {
			for (let key in payload){
				data.append(key, payload[key]);
			}
		}
		data.append('sessionId',sessionId);
		opts.data = data;
		opts.responseType= 'blob';
		opts.method='POST';
		opts.headers['Content-Type'] = 'multipart/form-data';
		delete opts.headers['Accept'];
	} else if(method=='MULTIPART'){
		opts.method = 'POST';
		opts.headers['Content-Type'] = 'multipart/form-data';		    
	
		const data = new FormData();
		for (let key in payload){
			data.append(key, payload[key]);
		}
		data.append('sessionId',sessionId);
		opts.data = data;
	} else {
		opts.data = JSON.stringify(opts.data);
	} 	
	return new Promise((resolve, reject)=>{axios(opts).then(resolve).catch(reject)});
}

const	get     = (url,payload,ajaxOpts)=> ajax('GET',url,payload,ajaxOpts);
const	post    = (url,payload,ajaxOpts)=> ajax('POST',url,payload,ajaxOpts);
const	postFile= (url,payload,ajaxOpts)=> ajax('POST_FILE',url,payload,ajaxOpts);
const	del     = (url,payload,ajaxOpts)=> ajax('DELETE',url,payload,ajaxOpts);
const	put     = (url,payload,ajaxOpts)=> ajax('PUT',url,payload,ajaxOpts);
const	mpt 	= (url,payload,ajaxOpts)=> ajax('MULTIPART',url,payload,ajaxOpts);

const	setBase  = (newBase)=>{ BASE_URL = newBase; }
const   setMode  = (newMode)=>{ MODE = newMode;}
const	setSid   = (newSid) =>{ sessionId = newSid;}
const	eraseSid = ()=>{ sessionId = null; }

const	out = (res) => {
	
    let filename = (res.headers['content-type'] || "").replace("attachment; filename=", "");
    filename = decodeURI(filename);
  	const hasWarns = res.headers['content-language'];
    const warn = hasWarns && decodeURI(hasWarns);
    const data = new Blob([res.data], {type: 'application/octet-stream'});
    const answ = window.URL.createObjectURL(data);
    let tempLink = document.createElement('a');
    tempLink.href = answ;
    tempLink.setAttribute('download', filename);
    tempLink.click();

    setTimeout(() => {
        tempLink && (tempLink.remove());
    }, 5000);

    return warn;
}

export {setBase,setMode,get,post,postFile,del,put,out,setSid,eraseSid,mpt};