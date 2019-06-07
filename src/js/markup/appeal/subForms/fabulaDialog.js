import * as _ from 'lodash'
import React from 'react'
import ReactDOM from 'react-dom'
import {Dialog,Select,Input,Collapse,Button, Tag} from 'element-react'
import { connect } from 'react-redux'
import {post} from '../../../services/ajax.js'
import {fetchSelect,fetchFabulasThemesMadi,baseUrl} from '../../../services/api.js'
import {getSessionId, getSystem} from '../../../selectors/common.js'
import DocPreview from './docPreview.js'
import mapping from '../mapping.js'
import '../../../../scss/ishdocExtraStyle.scss'

const M = mapping.fabulaDialog;
// const st = {width: '200px',display: 'inline-block'}


const WAITING = "Ожидайте..";

class FabulaDialog extends React.Component {

	constructor(props){
		super(props);
		this.state={
			docList: null, // null==not initialized, []==empty
			doc: null, // {fabulaDoc, fileName, fileId}
			secList: null,
			strVal: 'Необходимо выбрать документ',
			showDialog: false,
			downloadDocLink: null
		}

		this.setString = this.setString.bind(this);
		this.downloadDocument = this.downloadDocument.bind(this);
	}

	componentDidMount(){
		const {doc_type_id} = this.props; 
		const alias = 'GET_FAB_DOC';
		const listValueField = 'value' ;
		post("db/select",{alias,listValueField,doc_type_id}).then(x=>this.setState({docList: x.data||x}));
	}

	async setDoc(doc){		
		const theme_id = this.props.related_topic_id || null;
		const alias    = 'GET_FAB_SEC';
		const listValueField = 'value' ;
		const secResp  = await post('db/select',{alias,doc_id: doc.property,theme_id,listValueField});
		const secList = secResp.data || [];
		this.setState({doc,secList});			
		if (_.isEmpty(secList)){
			this.downloadDocument('docx',doc);
		} else {
			this.setString("Необходимо указать секцию")
		}
	}

	setSection(sec){
		const {doc} = this.state;
		this.downloadDocument('docx',doc,sec);
	}

	closePreview() {
		this.setState({showDialog : false});
	}

	setString(strVal) {
		this.setState({strVal});
	}

	download(href,filename){
		fetch(href).then(res => {
        	filename = (res.headers.get("Content-Disposition") || "").replace("attachment; filename=","").replace("; charset=utf-8", "");
        	filename = filename.replace(new RegExp("\"", 'g'), "");
         	filename = decodeURI(filename);
        	return res.blob();
    	}).then(res => { 
        	const data = new Blob([res], {type: 'application/octet-stream'});
        	const answ = window.URL.createObjectURL(data);
        	let tempLink = document.createElement('a');
        	tempLink.href = answ;
        	let event = document.createEvent('MouseEvents');
			event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0
								, false, false, false, false, 0, null);
			tempLink.setAttribute('download', filename);
			tempLink.dispatchEvent(event);
			this.setString("");
          	setTimeout(()=>{
            	tempLink && (tempLink.remove());
          	},5000);
        }).catch(x=>{
            messageSet(x,'error');
            console.error(x);
           	this.setString("");
        }); 
	}

	downloadDocument(ext,doc={},section={}){
		this.setString(WAITING);
		const document_id = doc.property;
		const fabula_section_id = section.property;
		const {i_claim_id,i_claim_theme_id,sessionId,i_claim_ishdoc} = this.props;

		const params = new URLSearchParams();
		params.append('sessionid',sessionId);
		params.append('i_claim_id',i_claim_id);
		params.append('i_claim_theme_id',i_claim_theme_id);
		params.append('i_claim_ishdoc',i_claim_ishdoc);
		params.append('document_id',document_id);
		params.append('fabula_section_id',fabula_section_id||null);
		params.append('ext',ext);

		const downloadDocLink = baseUrl() + 'doc/get_docx?'+params.toString()
		this.download(downloadDocLink,'docx.docx');
	}

	freezeForm() {
		return ReactDOM.createPortal(
			<div className='formFr'></div>,
			document.body);
	} //

	render() {
		let {doc,docList,secList,showDialog,downloadDocLink,strVal} = this.state;
		const {cancel,done,title,zajav} = this.props;

		const blocker = strVal===WAITING 
			? this.freezeForm() 
			: null;

		const SHDIAL = !showDialog 
      		? null 
      		: ( <Dialog key='mku7'
              title="Tips"
       		  size="tiny"
        	  visible={ true }
        	  onCancel={()=>{}}>
              <Dialog.Body>
                <DocPreview 
                	downloadDoc ={()=>this.downloadDocument(this)}
					downloadPdf ={()=>this.downloadDocument(this)}
                	closePreview={this.closePreview.bind(this)} document={downloadDocLink}/>
              	</Dialog.Body>
          	</Dialog>); //

		docList = docList || [];

		return ( 
	      [<Dialog 
	      	className="dialIsh"
	        title={title}
	        size="tiny"
	        visible={true}
	        onCancel={cancel}
	        showClose={false}
	        closeOnClickModal={false}
	        closeOnPressEscape={false}
	        lockScroll={true} >

	        <Dialog.Body className='dialBod'>
			        			<div className = 'spDiv'>Выбор документа</div>
			        				<Select className='selEl' value={this.state.doc} onChange={this.setDoc.bind(this)} >
										{ docList.map(el =>(<Select.Option key={el.property} label={el.value} value={el} />)) }
									</Select>
		        		{_.isEmpty(secList) ? null
		        			: (<React.Fragment>
		        				<div className = 'spDiv'>Выбор секции</div>
				        				<Select className='selEl' value={this.state.sec} onChange={this.setSection.bind(this)} >
											{ secList.map(el =>(<Select.Option key={el.property} label={el.value} value={el}  />)) }
										</Select>
								</React.Fragment>)}
	        </Dialog.Body>

	        <Dialog.Footer className="dialog-footer, dialFoot">
	        			<div className = 'ftMes'>{strVal}</div>
	        			<Button className='spBtn' onClick={cancel}>Отмена</Button>
	        </Dialog.Footer>

	      </Dialog>, SHDIAL, blocker]);
	}//
};


const mapStateToProps = (state,props)=>{
	const sessionId = getSessionId(state);
	const i_claim_id = state.getIn(['form','appeal','values','id']);
	const i_claim_theme_id = props.related_topic_id;
	const i_claim_ishdoc = props.ish_doc_id;            
            
	return {sessionId,i_claim_id,i_claim_theme_id,i_claim_ishdoc};
}

export default connect(mapStateToProps)(FabulaDialog);
