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
		<Card className="fileCard" bodyStyle={{'padding': 0}}>
				<div className="fileCard__header">
						<i className="ico defaultFile"></i>
				</div>
				<div className="fileCard__footer">
						<Popover placement="left" width="200px" trigger="click" content={(
										<div className="flex-parent flex-parent--column popoverContent">
												<Button className="actionButton py0 ml0" size="small" type="text" onClick={()=>download(x.get('storage_id'),x.get('description'))}>
														<i className="ico download mr6"/> скачать
												</Button>
										</div>
								)}>
								<Button className="action py0" size="small" type="text">
										<i className="ico dot"/>
								</Button>
						</Popover>

						<div className="content">
								<p className="fileName" title="Скачать" onClick={()=>download(x.get('storage_id'),x.get('description'))}>{x.get('description')}</p>
								{x.get('type_name') ? <p className="txt-em">{x.get('type_name')}</p> : null}
						</div>

				</div>
		</Card>
	)); //

	return (
		<div className="flex-parent flex-parent--wrap">{ROWS}</div>
	);
}
