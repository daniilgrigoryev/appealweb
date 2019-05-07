import getCadespluginAPI from 'async-cadesplugin'

const extractSignerInfo=(sinfo='')=>sinfo.split(', ').filter(x=>x.indexOf('OU=')==0 || x.indexOf('CN=')==0).map(x=>x.substr(x.indexOf('=')+1)).join(' -> ');
const CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED = 0; // embed signature

let CERTS = [];

const str2xml = (text)=>{
  const parser = new DOMParser();
  return parser.parseFromString(text,"text/xml");
}

const getCertificates = async ()=>{
  if (_.size(CERTS)){
    return CERTS;
  }
  const api   = await getCadespluginAPI();
  const certs = await api.getValidCertificates();
  CERTS = certs;
  return CERTS;
}

const sign = (blob,cert)=>{
  return new Promise((resolve,reject)=>{
    const reader = new FileReader();
    reader.onloadend = async ()=>{
      const base64data = reader.result.replace("data:application/pdf;base64,","");          
      const ret = await performCades(base64data, cert);
      debugger;
      resolve(ret);
    }
    reader.readAsDataURL(blob);
  });
}

const signXmlBlob = (blobXML,cert)=>{
  return new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onloadend = async ()=>{
        debugger;
        const xml = reader.result;  
        const api = await getCadespluginAPI();        
        const ret = await api.signXml(cert.thumbprint, xml, CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED);
        debugger;
        resolve(ret);
      }
      reader.readAsText(blobXML);
  });
}

const signXml = async (xml,cert)=>{
    const api = await getCadespluginAPI();        
    const ret = await api.signXml(cert.thumbprint, xml, CADESCOM_XML_SIGNATURE_TYPE_ENVELOPED);
    return ret;
}
       
const performCades = async (base64data, cert) => {
      try {
          const api          = await getCadespluginAPI();
          const signatureB64 = await api.signBase64(cert.thumbprint, base64data, false);
          const ver          = await api.verifyBase64(signedB64, base64data, false);
          if (!ver){
            throw 'Verification failed.';
          }
          const prefixedB64 = 'data:application/pdf;base64,' + signatureB64;
          const blobSigned  = await b64toBlob(prefixedB64);
          return blobSigned;
      } catch (error) {
        let msg = error.message || '';
          if (msg.indexOf("0x8010006E")>-1) {
              msg += "\nПароль не введен\n"
          }
          if (msg.indexOf("0x8009001A")>-1 || msg.indexOf("0x80090016")>-1) {
              msg += "\nРутокен не подключен\n"
          }
          throw msg;
      }
}



const b64toBlob = async (b64Data, contentType='application/octet-stream') => {
  const url = `data:${contentType};base64,${b64Data}`;
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
};  

export {getCertificates,sign,extractSignerInfo,signXml,signXmlBlob}