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
import {SearchRoot} from '../components/searchRoot.js'
import map from '../../markup/appeal/mapping.js'
import * as _ from 'lodash'

const MS = map.status;
const MB = map.basicData;
const MC = map.claimantData;

const timeOfs = new Date().getTimezoneOffset() * 60 * 1000;

const im = (obj) => Immutable.fromJS(obj)

const desc = {
    info_alias: 'i_obr',
    alias: 'APPEAL_LIST'
}

const style = {textAlign: 'center', width: '8em'};
const mapping = {
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

const templating = {};

class AppealExplorer extends React.Component {

    constructor(props) {
        super(props);
        const fields  = []
        this.state    = {fields};
        this.where    = {};
        this.key      = 0;

        this.conditionGetter = null;
        this.search   = this.search.bind(this);
    }

    componentDidMount(){
        const alias='TABLE_INFO';
        const table_alias= 'i_obr';
        const orphan = true;
        post('db/select',{alias,table_alias,orphan}).then(x=>{
            const {data,error} = x;
            if (_.size(data)){
                this.setState({fields:data});   
            }
        })
    }

    openRow(rowData, column) {
        const {dispatch, change, initialize} = this.props;
        const alias = 'CLAIM_GET';
        const orphan = true;
        return async () => {
            const claim_id = rowData.ID;
            const x = await post('db/select', {alias, claim_id,orphan});
            dispatch(initialize(im(x.data)));
            relocate('appeal_incoming');
        }
    }

    search() {
        const s = this.conditionGetter();
        const w = _.chain(s).filter(x=>x.value).value();
        if (!_.size(w)){
            console.error('no condition found');
            return;
        }

        this.where = w;        
        this.key = 'k' + new Date().getTime();
        this.forceUpdate();
    }

    render() {
        const {key,where,state} = this;
        const {fields} = state;
        const noTable = _.isEmpty(where);
        const {sid} = this.props;

        templating['REG_NUM'] = (rowData, column) => {
            return <a onClick={this.openRow(rowData)}>{rowData.REG_NUM}</a>;
        }//

        const actionCol =  null && {style, body};
        const setGetter = (getter)=>this.conditionGetter = getter;

        return (
            <React.Fragment>
                <Layout.Row gutter="0">
                    <Layout.Col span="24">
                        <Card className="box-card" header={
                            <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                                <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                    Поиск обращений
                                </h3>
                            </div>
                        }>

                            <SearchRoot {...{fields,setGetter}} />

                            <div className='mt12'>
                                <Button type="primary" onClick={this.search}>Искать</Button>
                            </div>
                        </Card>
                    </Layout.Col>
                </Layout.Row>

                { noTable ? <div className='mt60'><h3 className='txt-h3 align-center color-darken10'>Нет результатов поиска</h3></div>
                          : <Card className="box-card" bodyStyle={{ padding: '0' }}>
                                <AppealTable {...{key,sid,desc,actionCol,mapping,templating,where}} hdelta={'420'} />
                            </Card>}
            </React.Fragment>
        )
    } //
}

const state2props = (state) =>({sid: getSessionId(state)})

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