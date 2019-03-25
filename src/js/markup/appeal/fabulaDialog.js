import * as _ from 'lodash'
import React from 'react'
import {Dialog,Select,Input,Collapse,Button, Tag} from 'element-react'
import { connect } from 'react-redux'
import {post} from '../../services/ajax.js'
import {fetchSelect,fetchFabulasThemesMadi,baseUrl} from '../../services/api.js'
import DocPreview from './subForms/docPreview.js'

import mapping from './appealContent/mapping.js'
const M = mapping.fabulaDialog;

const st = {
	width: '200px',
    display: 'inline-block'
}

const generateTitle = (cat,theme)=>(
	<div style={st}>
		<span>Категория: {cat}</span>
		<span>Тема: {theme}</span>
	</div>
);//

class FabulaDialog extends React.Component {

	constructor(props){
		super(props);
		this.state={
			docList: null, // null==not initialized, []==empty
			doc: null, // {fabulaDoc, fileName, fileId}

			catList: null,
			cat: null, // {id,label}

			themeList: null,
			theme: null,  // {category,fabulaTheme,decision,text}
			showDialog: false,
			link: null
		}
	}

	componentDidMount(){
		const {type,system} = this.props
		post("rest/selectList",{alias : 'GET_FABULAS_THEMES', listValueField : 'value', category:type,system})
			.then(docList=>this.setState({docList: docList.data || docList}));
	}

	setDoc(doc){
		const catList = [];
		const cat = void 0;
		const themeList = [];
		const theme = void 0;
		
		this.setState({doc,catList,cat,themeList,theme}); // clear depencies	
		if (!doc){
			return;
		}
		this.downloadDoc(doc);
		//fetchSelect('fabulasCategories').then((catList=[])=>this.setState({catList: catList.data || catList}));
	}

	setCategory(categoryList){
		if (categoryList[0]==''){ // ignore closing
			this.forceUpdate();
			return;
		}

		const {catList} =  this.state;
		const themeList = [];
		const theme = void 0;
		//debugger; // cat
		const cat = _.chain(categoryList)
			.filter((x,i)=>!i)
			.map(x=>(catList || []).filter(list=>list.label == x))
			.flatten()
			.first()
			.value();

		if (this.state.cat!=cat){
			this.setState({cat,themeList,theme}); // clear depencies	
			if (!cat){
				return;
			}
			//debugger;
			const category = cat;
			fetchSelect('fabulasThemes',category).then((themeList=[])=>this.setState({themeList}));	
		}
	}

	setTheme(theme){
		this.setState({theme});
	}

	downloadDocx(e) {
			const {type,system} = this.props
			const fabulaDoc = 'fabulaDoc'
			const fabulaSection = 'fabulaSection' 

			const params = new URLSearchParams()
			params.append('fabulaDoc',fabulaDoc)
			params.append('fabulaSection',fabulaSection)
			params.append('ext','preview')
			params.append('zajavId', '')
			params.append('system',system)
			params.append('type',type)

			const link = baseUrl() + 'rest/preview?'+params.toString()
	    	this.setState({showDialog : true, link});
	}

	closePreview() {
		this.setState({showDialog : false});
	}

	download(href,filename){
		var tempLink = document.createElement('a');
        tempLink.href = href;
        tempLink.setAttribute('download', filename);
        tempLink.click();

        setTimeout(()=>{
          tempLink && (tempLink.remove());
        },5000);
	}

	downloadDoc(doc){
		const fabulaDoc = doc.property || 'fabulaDoc'
		const fabulaSection = null && 'fabulaSection' 
		const ext = 'docx'

		const params = new URLSearchParams()
		params.append('fabulaDoc',fabulaDoc)
		params.append('fabulaSection',fabulaSection)
		params.append('ext','docx')
		params.append('zajavId', this.props.claim_id)
		params.append('file',doc.property)
		params.append('system',this.props.system)
		params.append('type',this.props.type)
		

		const link = baseUrl() + 'rest/get_docx?'+params.toString()
		this.download(link,'docx.docx');
	}

	downloadPdf(){
		const fabulaDoc = 'fabulaDoc'
		const fabulaSection = 'fabulaSection' 
		const ext = 'pdf'

		const params = new URLSearchParams()
		params.append('fabulaDoc',fabulaDoc)
		params.append('fabulaSection',fabulaSection)
		params.append('ext','pdf')
		params.append('zajavId', '')

		const link = baseUrl() + 'rest/get_docx?'+params.toString()
		this.download(link,'pdf.pdf');
	}

	render() {
		let {doc,docList,cat,catList,showDialog,link} = this.state;
		const {cancel,done,title,zajav} = this.props;

		if (!cat && _.size(catList)){
			cat = catList[0];
		}

		const activeName = cat ? cat.label : null;
		const CATEGORIES = this.renderCategories();

		const SHDIAL = !showDialog 
      		? null 
      		: ( <Dialog key='mku7'
              title="Tips"
       		  size="tiny"
        	  visible={ true }
        	  onCancel={() => {}}>
              <Dialog.Body>
                <DocPreview 
                	downloadDoc={this.downloadDoc.bind(this)}
					downloadPdf={this.downloadPdf.bind(this)}
                	closePreview={this.closePreview.bind(this)} document={link}/>
              </Dialog.Body>
          	</Dialog>); //

		docList = docList || [];

		return ( 
	      [<Dialog
	        title={title}
	        size="tiny"
	        visible={true}
	        onCancel={cancel}
	        showClose={false}
	        closeOnClickModal={false}
	        closeOnPressEscape={false}
	        lockScroll={true} >

	        <Dialog.Body>
	        	<table className='w-full'>
	        		<tbody>
		        		<tr className='flex-parent flex-parent--center-cross'>
		        			<td className='ap-input-caption'>{M.DOCUMENT.label}</td>
		        			<td>
		        				<Select value={this.state.doc} onChange={this.setDoc.bind(this)} >
									{ docList.map(el =>(<Select.Option key={el.property} label={el.value} value={el}  />)) }
								</Select>
							</td>
		        		</tr>
		        		<tr className='flex-parent flex-parent--center-cross'>
		        			<td className='ap-input-caption'>{M.ZAJAV_TYPE.label}</td>
		        			<td>
								<Tag type="gray" className='my6'>{zajav=='UL'?'ЮЛ':'ФЛ'}</Tag>
							</td>
		        		</tr>
		        		{false && <tr className='flex-parent flex-parent--center-cross'>
		        			<td className='ap-input-caption'>{M.TEMPL_FILE.label}</td>
		        			<td>
                                <Tag type="gray" className='my6'>{!doc ? '<не выбран>' :(<a href={'fabulas/'+doc.fileName} >{doc.fileName}</a>)}</Tag>
							</td>
		        		</tr>}
		        		<tr>
		        			<td colSpan='2'>
				        		<Collapse value={activeName} onChange={this.setCategory.bind(this)} accordion>
							      {CATEGORIES}
							    </Collapse>
							</td>
						</tr>
	        		</tbody>
	        	</table>
	        </Dialog.Body>

	        <Dialog.Footer className="dialog-footer">
	          <Button onClick={cancel}>Отмена</Button>
	        </Dialog.Footer>
	      </Dialog>, SHDIAL]
		);
	}//

	renderCategories(){
		const {doc,docList,cat,catList,theme,themeList} = this.state;

		const hasDoc = !!doc;
		const hasCat = !!cat;
		const existsCat = catList!==null && _.size(catList);
		
		const ready = hasDoc && (!existsCat || hasCat);
		
		if (!hasDoc){
			return null;
		} else if (!existsCat){
			return null && (<Button size="small"><i className="el-icon-upload el-icon--left"></i>Загрузить</Button>);
		}

		return catList.map((x,i)=>
				<Collapse.Item key={i} title={generateTitle('заголовок','тема')} name={'Категория '+i} >
					<table>
						<tbody>
							<tr>
								<td>{M.FABULA.label}</td>
								<td>
									<Select value={this.state.cat} onChange={this.setTheme.bind(this)}>
									 	{ (themeList||[]).map(el =>(<Select.Option key={el.fabulaTheme} label={el.fabulaTheme} value={el} />)) }
								    </Select>
								</td>
							</tr>
							<tr>
								<td>{M.DECISION.label}</td>
								<td>{theme ? theme.decision : ''}</td>
							</tr>
							<tr>
								<td colSpan='2'><Input value={theme ? theme.text : null}  type="textarea" /></td>
							</tr>	
							<tr>
								<td colSpan='2'><Button size="small"  onClick={this.downloadDocx.bind(this)}><i className="el-icon-upload el-icon--left"></i>Загрузить</Button></td>
							</tr>
						</tbody>
					</table>
				</Collapse.Item>);
	}//
};

const mapStateToProps = (state)=>{
	const system = state.getIn(['general','system']);
	const zajav = state.getIn(['form','appeal','values','zajavLic']);
	return {system,zajav};
}

export default connect(mapStateToProps)(FabulaDialog);