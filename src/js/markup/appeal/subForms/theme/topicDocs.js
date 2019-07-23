import React from 'react'
import {baseUrl} from '../../../../services/api.js'
import {Button, Card, Popover} from 'element-react'
export default (props)=>{
	const {rows,sessionId} = props; 
	if (!_.size(rows)){
		return (<p className="my6 txt-em color-gray align-center">Нет файлов по теме</p>);
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

	const ROWS = rows.map(x=>(

			<div className="row">
					<div className="column">
						<div className="label">Наименование</div>
						<div className="value w180 txt-truncate txt-nowrap">
								<p className="link" title="Скачать" onClick={()=>download(x.get('storage_id'),x.get('description'))}>
									{x.get('description') ? x.get('description') : <span className="txt-middle color-gray-light">[не заполнено]</span>}
								</p>
						</div>
					</div>
					<div className="column">
							<div className="label">Тип</div>
							<div className="value">
									{x.get('type_name') 
										? <p className="txt-em">{x.get('type_name')}</p> 
										: <span className="txt-middle color-gray-light">[не заполнено]</span>
									}
							</div>
					</div>
					<div className="column column--end">
						<div className="value">
								<Button style={{'border': '1px solid #eaebec','width':'25px','height': '25px'}} 
												className="py0 px0 round-full bg-white" 
												size="small" type="text" 
												onClick={()=>download(x.get('storage_id'),x.get('description'))}>
										<i className="ico download w12 h12"/>
								</Button>
						</div>
					</div>
			</div>
	));

	return (
		// <div className="flex-parent flex-parent--wrap">{ROWS}</div>
		<div className="flex-table ml0 px24">{ROWS}</div>
	);
}
