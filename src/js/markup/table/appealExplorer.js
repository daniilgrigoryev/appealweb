import React, {Component} from 'react';
import {compose} from 'redux'
import {FieldArray, reduxForm} from 'redux-form/immutable'
import AppealTable from './table.js'
import {getSessionId} from '../../selectors/common.js'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'
import {post} from '../../services/ajax.js'
import {appealLoad} from '../../actions/common.js'
import Immutable from 'immutable'
import {relocate} from '../app/app.js'
import {EInput} from '../components/finput.js'
import {ESelect} from '../components/select.js'
import {EAutocomplete} from '../components/fautocomplete.js'
import {EPicker} from '../components/picker.js'
import mapping from '../../markup/appeal/appealContent/mapping.js'
import * as _ from 'lodash'

const MS = mapping.status;
const MB = mapping.basicData;
const MC = mapping.claimantData;

const timeOfs = new Date().getTimezoneOffset() * 60 * 1000;

const im = (obj) => Immutable.fromJS(obj)

const desc = {
    alias: 'APPEAL_LIST'
}

const style = {textAlign: 'center', width: '8em'};
const mappingT = {
    //ID: 'ИД',
    REG_NUM: 'Регистрационный номер',
    DATE_REG: 'Дата регистрации',
    //DATE_CONTROL:'Дата контроля',  
    NAME: 'Обращенец',
    FP_NAME: 'Физ. лицо',
    JP_NAME: 'ЮЛ наименование',
    //PHONE: 'Телефон',
    STAGE: 'Статус',
    ISP_NAME: 'Исполнитель',
    ISP_OTD: 'Отдел'
}

class AppealExplorer extends React.Component {

    constructor(props) {
        super(props);
        const search = {};
        this.state = {search};
        this.where = {};
        this.whereKey = 0;

        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
    }

    openRow(rowData, column) {
        const {dispatch, change, initialize} = this.props;
        const alias = 'CLAIM_GET';
        return async () => {
            const claim_id = rowData.ID;
            const x = await post('rest/select', {alias, claim_id});
            const raw = x.data.rows[0][0].value;
            const js = JSON.parse(raw);
            dispatch(initialize(im(js)));
            relocate('appeal_incoming');
        }
    }

    search() {
        const s = this.state.search;
        const w = Object.assign({}, s);
        
        for (var key in s){
          if (w[key] instanceof Date){
            w[key]= new Date(w[key].getTime()+timeOfs);
          } else if (!w[key] || w[key]=='void 0'){
            delete w[key];
          }
        }
        this.where = w;
        
        this.whereKey = 'k' + new Date().getTime();
        this.forceUpdate();
    }

    onChange(field) {
        const {search} = this.state;
        return (val) => {
            search[field] = val;
            this.setState({search});
        };
    }

    render() {
        const S = this.state.search;
        const noTable = _.isEmpty(this.where);
        const chg = this.onChange;

        const body = (rowData, column) => (<div>
            <Button size="small" onClick={this.openRow.bind(this)(rowData, column)}>Открыть</Button>
        </div>);
        const ac = {style, body};

        return (
            <React.Fragment>
                <h3 className="ap-h3">Настройки поиска</h3>

                <Layout.Row gutter="20">
                    <Layout.Col span="24">
                        <Card className="box-card mb24">

                            <Layout.Row gutter="20">
                                <Layout.Col xs="24" md="12" lg="8">
                                    <table className='w-full'>
                                        <tbody>
                                        <tr>
                                            <td className='ap-input-caption w180'>Регистрационный номер</td>
                                            <td colSpan='3'>
                                                <Input value={S['reg_num']} onChange={chg('reg_num')}/>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className='ap-input-caption w180'>Статус</td>
                                            <td colSpan='3'>
                                                <ESelect className='w-full' value={S[MS.STATUS.key]}
                                                         dataKey={MS.STATUS.key} onChange={chg(MS.STATUS.key)}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption w180'>Дата</td>
                                            <td>
                                                <EPicker className='w-full' value={S['date']} datepicker='+'
                                                         onChange={chg('date')}/>
                                            </td>
                                            <td colSpan='2'></td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption w180'>Диапазон дат от</td>
                                            <td>
                                                <EPicker className="w-full" value={S['date_from']} datepicker='+'
                                                         onChange={chg('date_from')}/>
                                            </td>
                                            <td className='ap-input-caption w60'>до</td>
                                            <td>
                                                <EPicker className="w-full" value={S['date_to']} datepicker='+'
                                                         onChange={chg('date_to')}/>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Layout.Col>
                                <Layout.Col xs="24" md="12" lg="8">
                                    <table className='w-full'>
                                        <tbody>
                                        <tr>
                                            <td className='ap-input-caption w180'>Физическое лицо</td>
                                            <td>
                                                <Input value={S['fl']} onChange={chg('fl')}/>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption w180'>Юридическое лицо</td>
                                            <td>
                                                <Input value={S['ul']} onChange={chg('ul')}/>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className='ap-input-caption w180'>Телефон</td>
                                            <td><Input value={S['phone']} onChange={chg('phone')}/></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Layout.Col>
                                <Layout.Col xs="24" md="12" lg="8">
                                    <table className='w-full'>
                                        <tbody>
                                        <tr>
                                            <td className='ap-input-caption w180'>Исполнитель</td>
                                            <td><EAutocomplete className="w-full" value={S[MS.EXECUTOR.key]}
                                                               dataKey={MS.EXECUTOR.key}
                                                               onChange={chg(MS.EXECUTOR.key)}/></td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption w180'>Отдел</td>
                                            <td><EAutocomplete className="w-full" value={S[MS.DEPART.key]}
                                                               dataKey={MS.DEPART.key}
                                                               onChange={chg(MS.DEPART.key)}/></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </Layout.Col>
                            </Layout.Row>

                            <div className='mt12'>
                                <Button type="primary" onClick={this.search}>Искать</Button>
                                {false && <Button type="text" className='ml24'>Очистить</Button>}
                            </div>
                        </Card>
                    </Layout.Col>
                </Layout.Row>

                {noTable && <div className='mt120'>
                    <h3 className='txt-h3 align-center color-darken10'>Нет результатов поиска</h3>
                </div>}
                {!noTable &&
                <React.Fragment>
                    <h3 className='ap-h3 mb-neg12'>Найденные обращения</h3>

                    <AppealTable key={this.whereKey} sid={this.props.sid} desc={desc} actionCol={ac} mapping={mappingT}
                                 hdelta={'500'} where={this.where}/>
                </React.Fragment>
                }
            </React.Fragment>
        )
    } //
}

const state2props = (state) => {
    return {sid: getSessionId(state)};
}

export default compose(
    connect(state2props),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
        enableReinitialize: true
        //validate
    })
)(AppealExplorer)

//export default connect(state2props)(AppealExplorer);