import * as _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {Button, Card} from 'element-react'
import {getSessionId, getSystem} from '../../selectors/common.js'
import {post} from '../../services/ajax.js'
import FabulaSecEditor from './fabulaSecEditor.js'

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
		post('db/select',{alias,denormalize,doc_id,sys}).then(x=>this.setState({rows:x.data}));
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

        if (doc_id == -1 || (typeof doc_id == "undefined")) {
            return <p className='my6 txt-em color-gray align-center'>Редактирование секций доступно только для сохраненных документов</p>;
        }

        const {rows} = this.state;

        const ROWS = _.isEmpty(rows) ? null : rows.map(this.getRow);

        return (
            <Card bodyStyle={{padding: '0'}} className="box-card sectionCard" header={
                <div className='headline'>
                    <h3>Фабулы секций</h3>
                </div>}>
                    {_.isEmpty(rows) 
                    ? <p className="my6 txt-em color-gray align-center">Нет секций для отображения</p>
                    : <table className='w-full table-styled'>
                        <tbody>
                            <tr>
                                <td className='ap-input-caption'></td>
                                <td>
                                    <table className='w-full mb18'>
                                        <thead>
                                        <tr>
                                            <td className='ap-table__th ap-table__header'>Наименование</td>
                                            <td className='ap-table__th ap-table__header'>Категория</td>
                                            <td className='ap-table__th ap-table__header'>Решение</td>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {ROWS}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                      </tbody>
                    </table>
                }
                <Button size="small" icon="plus" className="mb18 mt6 mx-auto block" plain={true} onClick={() => this.addRow()}>
                    Добавить секцию
                </Button>
            </Card>);
    }

  	 getRow(x) {
        const id = x.ID || -1;
        const {expandedRowId} = this.state;
        if (id == expandedRowId) {
            const {doc_id} = this.props;
            return (
                <td colSpan='3' className='ap-table__td'>
                    <FabulaSecEditor doc_id={doc_id}
                                     fabSec={x}
                                     reloadParent={this.reload}
                                     cancelEdit={() => this.selectRow(void 0)}/>
                </td>);
        }

        return (<tr key={id} className='ap-table__tr'>
            <td className='ap-table__td'>
                <a onClick={() => this.selectRow(id)}>{x.NAME}</a>
            </td>
            <td className='ap-table__td'>{x.CAT}</td>
            <td className='ap-table__td'>{x.DECIS}</td>
        </tr>);
    } //
}

const state2props = (state) => {
    const sid = getSessionId(state);
    const sys = getSystem(state);
    return {sid, sys};
}

export default connect(state2props)(FabulaSecViewer);