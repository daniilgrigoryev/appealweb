import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {Button} from 'element-react'
import {getSessionId,getSystem} from '../../selectors/common.js'
import {post} from '../../services/ajax.js'
import FabulaDocEditor from './fabulaDocEditor.js'

class FabulaDocViewer extends React.Component {
  
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
		const {sys} = this.props; 
		const alias = 'FAB_DOC_'+sys;
		const denormalize = true;
		post('db/select',{alias,denormalize}).then(x=>this.setState({rows:x.data}));
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
  		const {rows} = this.state;
  		const styleDoc = {
  			height: 'calc(100vh - 60px)',
    		overflow: 'auto'
  		}

  		const ROWS = _.isEmpty(rows) 
  			? <tr><td colSpan='3'>Нет строк для отображения</td></tr>  
  			: rows.map(this.getRow);

  		return <div style={styleDoc}> 
	  		<table>
	  			<tbody>
	  				<tr>
	  					<td colSpan='2'>Фабулы документа</td>
	  					<td><Button onClick={()=>this.addRow()}>Добавить</Button></td>
	  				</tr>
	  				<tr>
	  					<td>Тип документа</td>
	  					<td>Заявитель</td>
	  					<td>Наименование</td>
	  				</tr>
	  				{ROWS}
	  			</tbody>
	  		</table>
	  	</div>;
  	}//

  	getRow(x){
  		const styleTD3 = {
  			'border' : '1px solid #aaa',
    		'padding': '10px'
  		}

  		const id = x.ID || -1;
  		const {expandedRowId} = this.state;
  		if (id==expandedRowId){
  			return (<td colSpan='3' style={styleTD3}>
  						<FabulaDocEditor cancelEdit={()=>this.selectRow(void 0)} fabDoc={x} reloadParent={this.reload} />
  					</td>);
  		} //

  		return (<tr key={id}>
  			<td>{x.DTYPE}</td>
  			<td>{x.ZAJAV}</td>
  			<td><a onClick={()=>this.selectRow(id)}>{x.NAME}</a></td>
  		  </tr>);
  	} //
}

const state2props = (state) => {
	const sid = getSessionId(state);
	const sys = getSystem(state);
	return {sid,sys};
}

export default connect(state2props)(FabulaDocViewer);