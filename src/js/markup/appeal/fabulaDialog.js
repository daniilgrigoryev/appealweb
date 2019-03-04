import * as _ from 'lodash'
import React from 'react'
import {Dialog,Select,Input,Collapse,Button, Tag} from 'element-react'
import { connect } from 'react-redux'
import {post} from '../../services/ajax.js'
import {fetchSelect,fetchFabulasThemesMadi} from '../../services/api.js'

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
			theme: null  // {category,fabulaTheme,decision,text}
		}
	}

	componentDidMount(){
		fetchSelect('fabulasDoc').then(docList=>this.setState({docList}));
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
		fetchSelect('fabulasCategories').then((catList=[])=>this.setState({catList}));
	}

	setCategory(categoryList){
		if (categoryList[0]==''){ // ignore closing
			this.forceUpdate();
			return;
		}

		const {catList} =  this.state;
		const themeList = [];
		const theme = void 0;
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
			fetchSelect('fabulasThemes').then((themeList=[])=>this.setState({themeList}));	
		}
	}

	setTheme(theme){
		this.setState({theme});
	}

	render() {
		let {doc,docList,cat,catList} = this.state;
		const {cancel,done,title,zajav} = this.props;

		if (!cat && _.size(catList)){
			cat = catList[0];
		}

		const activeName = cat ? cat.label : null;
		const CATEGORIES = this.renderCategories();

		docList = docList || [];

		return (
	      <Dialog
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
									{ docList.map(el =>(<Select.Option key={el.id} label={el.label} value={el}  />)) }
								</Select>
							</td>
		        		</tr>
		        		<tr className='flex-parent flex-parent--center-cross'>
		        			<td className='ap-input-caption'>{M.ZAJAV_TYPE.label}</td>
		        			<td>
								<Tag type="gray" className='my6'>{zajav=='UL'?'ЮЛ':'ФЛ'}</Tag>
							</td>
		        		</tr>
		        		<tr className='flex-parent flex-parent--center-cross'>
		        			<td className='ap-input-caption'>{M.TEMPL_FILE.label}</td>
		        			<td>
                                <Tag type="gray" className='my6'>{!doc ? '<не выбран>' :(<a href={'fabulas/'+doc.fileName} >{doc.fileName}</a>)}</Tag>
							</td>
		        		</tr>
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
	      </Dialog>
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
			return (<Button size="small"><i className="el-icon-upload el-icon--left"></i>Загрузить</Button>);
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
								<td colSpan='2'><Button size="small"><i className="el-icon-upload el-icon--left"></i>Загрузить</Button></td>
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