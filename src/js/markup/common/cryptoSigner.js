import React, { useState,useEffect, useRef} from 'react'
import {getCertificates,extractSignerInfo} from '../../services/crypto.js'

const EMPTY = {thumbprint: -1, subjectInfo:'CN=Выбор сертификата ЭЦП' };
	
export default (props)=>{
	const [list,setList] = useState([EMPTY]);
	
	const onList = (x)=>setList([EMPTY, ...x]);	

	const onChange = (e)=>{
		const {value} = e.target;
		const el = list.filter(x=>x.thumbprint==value)[0];
		(el.thumbprint!=-1) && (props.doSign(el));
	}

	useEffect(()=>(list.length==1 && (getCertificates().then(onList)), void 0));

	return (<select style={{width:'300px'}} onChange={onChange}>
                {list.map(x=><option key={x.thumbprint} value={x.thumbprint}>{extractSignerInfo(x.subjectInfo)}</option>)}
            </select>);
} //