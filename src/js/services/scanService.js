import axios from 'axios'

const curHttps = window.location.protocol.indexOf('https')>-1;

const getUrl = (isHttps)=> isHttps 
					? 'https://localhost:23024/' 
					: 'http://localhost:23022/';

const getOpts = (isHttps)=>{
	const url = getUrl(isHttps);
	return {
		url,
	  	method:'GET',
		responseType: 'blob',
	  	data: {}
  	}
};

const scanPdf = (forceHttp=false)=>{
	let https = forceHttp ? false : curHttps;
	const opts = getOpts(https);
	return new Promise((resolve, reject)=>(axios(opts).then(response=>resolve(new Blob([response.data]))).catch(reject)),true);
}

export {scanPdf}