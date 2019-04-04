import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {Button} from 'element-react'
import {getSessionId,getSystem} from '../../selectors/common.js'
import {post} from '../../services/ajax.js'
import FabulaSecEditor from './fabulaSecEditor.js'

const parse = (str)=>{
  return (typeof str=="string")
   ? JSON.parse(str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t"))
   : str;
}
class FabulaSecViewer extends React.Component {
  
	constructor(props){
		super(props);
		this.state = {
			rows: [],
			expandedRowId: null // -1 means new row
		}

		this.selectRow = this.selectRow.bind(this);
		this.reload = this.reload.bind(this);
		this.addRow = this.addRow.bind(this);
		this.getRow = this.getRow.bind(this);
		this.hasNewRow = this.hasNewRow.bind(this);
	}

	componentDidMount(){
		this.reload();
	}

	reload(){
		const {doc_id,sys} = this.props; 
		const alias = 'FABULA_SEC_GET';
		const denormalize = true;
		post('db/select',{alias,denormalize,doc_id,sys}).then(x=>{
      this.setState({rows:parse(x.data)})
    });
	}

	hasNewRow(){
		const {rows} = this.state;
		return !!_.chain(rows).filter(x=>x.ID==-1).map(x=>true).first().value();
	}

	addRow(){
		if (this.hasNewRow()){
			console.error('new row already exists');
			this.setState({expandedRowId:-1});
			return;
		}
		const {rows} = this.state;
		const newRows= [...rows,{ID:-1}];
		this.setState({expandedRowId:-1,rows:newRows});
	}

  	selectRow(expandedRowId){
  		this.setState({expandedRowId})
  	}

  	render() {
      const {doc_id} = this.props;

      if (doc_id==-1 || (typeof doc_id == "undefined")){
        return <div>Редактирование секций доступно только для сохраненных документов</div>;
      } //

  		const {rows} = this.state;

  		const ROWS = _.isEmpty(rows) 
  			? <tr><td colSpan='3'>Нет секций для отображения</td></tr>  
  			: rows.map(this.getRow);

  		return <table>
  			<tbody>
  				<tr>
  					<td colSpan='2'>Фабулы секций</td>
  					<td><Button onClick={()=>this.addRow()}>Добавить</Button></td>
  				</tr>
  				<tr>
  					<td>Категория</td>
  					<td>Решение</td>
  					<td>Наименование</td>
  				</tr>
  				{ROWS}
  			</tbody>
  		</table>;
  	}//

  	getRow(x){
  		const styleTD3 = {
  			'border' : '1px solid #aaa',
    		'padding': '10px'
  		}

  		const id = x.ID || -1;
  		const {expandedRowId} = this.state;
  		if (id==expandedRowId){
        const {doc_id} = this.props; 
  			return (<td colSpan='3' style={styleTD3}><FabulaSecEditor doc_id={doc_id} fabSec={x} reloadParent={this.reload} cancelEdit={()=>this.selectRow(void 0)} /></td>);
  		} //

  		return (<tr key={id}>
  			<td>{x.CAT}</td>
  			<td>{x.DECIS}</td>
  			<td><a onClick={()=>this.selectRow(id)}>{x.NAME}</a></td>
  		  </tr>);
  	} //
}

const state2props = (state) => {
	const sid = getSessionId(state);
	const sys = getSystem(state);
	return {sid,sys};
}

export default connect(state2props)(FabulaSecViewer);