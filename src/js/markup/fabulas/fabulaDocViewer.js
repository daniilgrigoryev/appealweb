import * as _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {Button, Card} from 'element-react'
import {getSessionId, getSystem} from '../../selectors/common.js'
import {post} from '../../services/ajax.js'
import FabulaDocEditor from './fabulaDocEditor.js'

class FabulaDocViewer extends React.Component {

    constructor(props) {
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

    componentDidMount() {
        this.reload();
    }

    reload() {
        const {sys} = this.props;
        const alias = 'FAB_DOC_' + sys;
        const denormalize = true;
        post('db/select', {alias, denormalize}).then(x => this.setState({rows: x.data}));
    }

    hasNewRow() {
        const {rows} = this.state;
        return !!_.chain(rows).filter(x => x.ID == -1).map(x => true).first().value();
    }

    addRow() {
        if (this.hasNewRow()) {
            console.error('new row already exists');
            this.setState({expandedRowId: -1});
            return;
        }
        const {rows} = this.state;
        const newRows = [...rows, {ID: -1}];
        this.setState({expandedRowId: -1, rows: newRows});
    }

    selectRow(expandedRowId) {
        this.setState({expandedRowId})
    }

    getRow(x) {
        const id = x.ID || -1;
        const {expandedRowId} = this.state;
        if (id == expandedRowId) {
            return (<td colSpan='3' >
                <FabulaDocEditor cancelEdit={() => this.selectRow(void 0)} fabDoc={x} reloadParent={this.reload}/>
            </td>);
        } //

        return (<tr key={id}>
            <td className='ap-table__td'><a onClick={() => this.selectRow(id)} title='Редактировать'>{x.NAME}</a></td>
            <td className='ap-table__td'>{x.DTYPE}</td>
            <td className='ap-table__td'>{x.ZAJAV}</td>
        </tr>);
    }

    render() {
        const {rows} = this.state;
        const styleDoc = {
            height: 'calc(100vh - 80px)',
            overflow: 'auto'
        }

        const ROWS = _.isEmpty(rows)
            ? <tr className='ap-table__tr'>
                <td className='ap-table__td' colSpan='3'>Нет строк для отображения</td>
            </tr>
            : rows.map(this.getRow);

        return <div style={styleDoc}>
            <Card className="ap-card-white-bg box-card"
                  bodyStyle={{padding: '0'}}
                  header={
                      <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                          Список фабул документов
                      </h3>
                  }>
                <table className='ap-table ap-table--bordered w-full'>
                    <thead>
                    <tr>
                        <th className='ap-table__th ap-table__header'>Наименование</th>
                        <th className='ap-table__th ap-table__header'>Тип документа</th>
                        <th className='ap-table__th ap-table__header'>Заявитель</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ROWS}
                    </tbody>
                </table>
            </Card>

            <div className="ap-footer">
                <Button icon="plus"
                        type="success"
                        plain={true}
                        onClick={() => this.addRow()}>
                    Новая фабула
                </Button>
            </div>

        </div>;
    }
}

const state2props = (state) => {
    const sid = getSessionId(state);
    const sys = getSystem(state);
    return {sid, sys};
}

export default connect(state2props)(FabulaDocViewer);