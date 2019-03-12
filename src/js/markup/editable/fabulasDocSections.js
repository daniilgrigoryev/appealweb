import * as _ from 'lodash'
import React from 'react'
import {connect} from 'react-redux'
import {getSessionId} from '../../selectors/common.js'
import {Dialog, Button} from 'element-react'
import * as F from '../table/fields.js'
import {post} from '../../services/api.js'
import {messageSet} from '../../actions/common.js'
import {ESelect} from '../components/select.js'
import {EInput} from '../components/finput.js'


class FabulasDocSections extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
            expandRow: null,

            categories: [],
            decisions: [],
            appeal_causes: []
        };

        this.renderCollapsedRow = this.renderCollapsedRow.bind(this);
        this.renderExpandedRow = this.renderExpandedRow.bind(this);
        this.updateRowProperty = this.updateRowProperty.bind(this);
        this.rollback = this.rollback.bind(this);
        this.pushRow = this.pushRow.bind(this);
        this.removeRow = this.removeRow.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            const rows = [
                {id: 0, name: 'Секция 1', cat: 'Категория 1', decision: 'Решение 1', appeal_cause: null, text: 'ТЕКСТ'},
                {id: 1, name: 'Секция 2', cat: 'Категория 2', decision: 'Решение 2', appeal_cause: null, text: 'ТЕКСТ'},
                {id: 2, name: 'Секция 3', cat: 'Категория 3', decision: 'Решение 3', appeal_cause: null, text: 'ТЕКСТ'},
                {id: 3, name: 'Секция 4', cat: 'Категория 4', decision: 'Решение 4', appeal_cause: null, text: 'ТЕКСТ'},
                {id: 4, name: 'Секция 5', cat: 'Категория 5', decision: 'Решение 5', appeal_cause: null, text: 'ТЕКСТ'},
                {id: 5, name: 'Секция 6', cat: 'Категория 6', decision: 'Решение 6', appeal_cause: null, text: 'ТЕКСТ'},
                {id: 6, name: 'Секция 7', cat: 'Категория 7', decision: 'Решение 7', appeal_cause: null, text: 'ТЕКСТ'},
                {id: 7, name: 'Секция 8', cat: 'Категория 8', decision: 'Решение 8', appeal_cause: null, text: 'ТЕКСТ'}
            ];
            const expandRow = _.first(rows) || null;
            this.setState({rows}, () => this.expandRow({}, expandRow));
        }, 1500);
    }

    hasChanges() {
        const {expandRow, rows} = this.state;
        if (!expandRow) {
            return false;
        }

        const row = expandRow;
        const dbRow = _.chain(rows).filter(x => x.id == row.id).first().value();

        for (let field in row) {
            if ((row[field] || '') != (dbRow[field] || '')) {
                return true;
            }
        }
        return false;
    }

    removeRow() { // ignore changes
        const {rows, expandRow} = this.state;
        const index = _.findIndex(rows, x => x.id == expandRow.id);
        if (index == -1) { // not found
            return;
        }
        const size = _.size(rows);
        const newIndex = Math.max(0, Math.min(size - 1, index - 1));

        setTimeout(() => {
            const newRS = rows.filter((x, i) => i != index);
            const newER = size == 1 ? null : rows[newIndex];
            this.setState({
                rows: newRS,
                expandRow: newER
            });
        }, 800);
    }

    rollback() {
        const {expandRow, rows} = this.state;
        if (!expandRow) {
            return;
        }
        const dbRow = _.chain(rows).filter(x => x.id == expandRow.id).first().value();
        this.setState({expandRow: dbRow});
    }

    pushRow() {
        const {expandRow, rows} = this.state;
        setTimeout(() => {
            const newRows = rows.map(x => x.id != expandRow.id ? x : Object.assign(x, expandRow));
            this.setState({rows: newRows});
        }, 800);
    }

    expandRow(evt, expRow) {
        if (this.hasChanges()) {
            this.props.dispatch(messageSet('Переключение строки невозможно: есть несохраненные изменения', 'warning'));
            return;
        }
        const expandRow = Object.assign({}, expRow);

        setTimeout(() => {
            const categories = ['Категория1', 'Категория2', 'Категория3', 'Категория4', 'Категория5'];
            const decisions = ['Решение1', 'Решение2', 'Решение3', 'Решение4'];
            const appeal_causes = ['Причина1', 'Причина2', 'Причина3', 'Причина4'];
            this.setState({expandRow, categories, decisions, appeal_causes});
        }, 500);
    }

    updateRowProperty(property) {
        return (val) => {
            let {expandRow} = this.state;
            if (!expandRow) {
                return;
            }
            const mix = {};
            mix[property] = val;
            expandRow = Object.assign({}, expandRow, mix);
            this.setState({expandRow});
        }
    }

    renderCollapsedRow(x, expandRow) {
        const exp = (x) => (evt) => this.expandRow(evt, x);
        return (
            <React.Fragment>
                <tr key={x.id}>
                    <td>
                        <span className='ap-table-list-number mr12'>1</span>
                    </td>
                    <td>
                        <span className='inline-block mr12'>{x.name}</span>
                    </td>
                    <td>
                        <span className='inline-block mr12'>{x.cat}</span>
                    </td>
                    <td>
                        <span className='inline-block mr12'>{x.decision}</span>
                    </td>
                    <td className="align-r pr12">
                        <span className="ml12">
                         <Button type="text" onClick={exp(x)} className='mr12'>
                             <i className="el-icon-edit color-green"/>
                         </Button>

                         <Button type="text">
                           <i className="el-icon-delete color-red-dark"/>
                       </Button>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td colSpan='5'>
                        <hr className='txt-hr my18'/>
                    </td>
                </tr>
            </React.Fragment>
        );
    }

    renderExpandedRow(stateRow, x) {
        const {categories, decisions, appeal_causes} = this.state;
        const upd = this.updateRowProperty;
        const CHG = this.hasChanges();
        const NEW = typeof x.id == 'undefined';

        return (
            <tr key={x.id}>
                <td colSpan='5'>
                    <div className='px12 py12 my6 border round border--gray-light shadow-darken10'>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <span className='ap-table-list-number mr12'>1</span>
                                </td>
                                <td>
                                    <span className="inline-block mr12">
                                        <EInput value={x.name} onChange={upd('name')}/>
                                    </span>
                                </td>
                                <td>
                                    <span className="inline-block mr12">
                                        <ESelect value={x.cat} onChange={upd('cat')} data={categories}/>
                                    </span>
                                </td>
                                <td>
                                    <span className="inline-block">
                                        <ESelect value={x.decision} onChange={upd('decision')} data={decisions}/>
                                    </span>
                                </td>
                            </tr>


                            <tr>
                                <td className='ap-input-caption'>Причина жалобы <br/> на постановление</td>
                                <td colSpan='3'>
                                    <span className="inline-block w-full">
                                    <ESelect className='w-full' value={x.appeal_cause} onChange={upd('appeal_cause')}
                                             data={appeal_causes}/>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption'>Комментарий</td>
                                <td colSpan='3'><EInput value={x.text} onChange={upd('text')} type="textarea"/></td>
                            </tr>
                            </tbody>
                        </table>

                        <hr className='txt-hr my18'/>

                        <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross'>
                            <div>
                                {!CHG ? null :
                                    <Button size="small" onClick={this.pushRow}>
                                        Сохранить
                                    </Button>
                                }

                                {!CHG ? null :
                                    <Button type="text" size="small" onClick={this.rollback}>
                                        <span className='color-blue'>Отменить</span>
                                    </Button>
                                }
                            </div>

                            <div>
                                {NEW ? null :
                                    <Button type="text" onClick={this.removeRow}>
                                        <i className="el-icon-delete color-red-dark"/>
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>

                    <hr className='txt-hr my18'/>


                </td>
            </tr>);
    } //

    findNewRow() {
        const {rows} = this.state;
        return (rows || []).filter(x => (typeof x.id == 'undefined'))[0];
    }

    getRow(id = void 0, name = '', cat = '', decision = '', appeal_cause = null, text = '') {
        return {id, name, cat, decision, appeal_cause, text};
    }

    addRow() {
        const {expandRow, rows} = this.state;

        if (this.hasChanges()) {
            this.props.dispatch(messageSet('Добавление новой строки невозможно: есть несохраненные изменения', 'warning'));
            return;
        }

        if (this.findNewRow()) {
            this.props.dispatch(messageSet('Добавление новой строки невозможно: список уже содержит незафиксированную запись', 'warning'));
            return;
        }

        const newRow = this.getRow();
        const newRS = [...rows, newRow];
        const newER = Object.assign({}, newRow);
        this.setState({
            rows: newRS,
            expandRow: newER
        });
    }

    render() {
        const {rows, expandRow} = this.state;
        const expandId = expandRow ? expandRow.id : null;
        const clp = this.renderCollapsedRow;
        const exp = this.renderExpandedRow;

        return (
            <div className='px24'>
                <hr className='txt-hr my18'/>
                <h4 className="ap-h4">Фабулы секций документа</h4>

                {!rows.length ?
                    <p className='mt-neg12 mb18 txt-em txt-s color-gray-light'>Нет документов</p>
                    :
                    <table className='wmin600 mb18'>
                        <thead>
                        <tr>
                            <th className='ap-table-header'></th>
                            <th className='ap-table-header'>Название</th>
                            <th className='ap-table-header'>Категория</th>
                            <th className='ap-table-header'>Решение</th>
                            <th className='ap-table-header align-r'>Операции</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows.map(x => (((x.id === expandId) ? exp : clp)(x, expandRow)))}
                        </tbody>
                    </table>
                }

                <Button size="small" icon="plus" onClick={this.addRow}
                        className="flex-parent mb18"
                        title='Добавить тему'>
                    Добавить
                </Button>
            </div>
        );
    } //
}

const state2props = (state) => {
    return {sid: getSessionId(state)};
}

export default connect(state2props)(FabulasDocSections);