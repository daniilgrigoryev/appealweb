import React from 'react'
import {baseUrl} from '../../../../services/api.js'

export default (props)=>{
	const {rows,sessionId} = props; 
	if (!_.size(rows)){
		return (<span>Нет файлов по теме</span>);
	} //

	const download = (storage_id, description)=>{
		const params = new URLSearchParams();
	    params.append('sessionId',sessionId);
	    params.append('storage_id',storage_id);
	    
	    const path = 'storage/pull?'; 
	    const tempLink = document.createElement('a');
	    tempLink.href = baseUrl() + path + params.toString();
	    tempLink.setAttribute('download', description);
	    tempLink.click();
	    setTimeout(()=>(tempLink && (tempLink.remove())),5000);    
	}

	const ROWS = rows.map(x=>(<tr onClick={()=>download(x.get('storage_id'),x.get('description'))}>
		<td>{x.get('type_name')}</td>
		<td>{x.get('description')}</td>
	</tr>)); //

	return (
		<table>
			<thead>
				<tr>
				   <th>Тип</th>
				   <th>Наименование</th>
				 </tr>
			</thead>
			<tbody>
				{ROWS}
			</tbody>
		</table>
	);
}
