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
    alias: 'APPEAL_VERIFY_LIST'
}

const style = {textAlign: 'center', width: '8em'};
const mapping = {
    REG_NUM: 'Регистрационный номер',
    DATE_REG: 'Дата регистрации',
    NAME: 'Заявитель',
    FP_NAME: 'Физ. лицо',
    JP_NAME: 'ЮЛ наименование',
    ISP_NAME: 'Исполнитель',
    ISP_OTD: 'Отдел',
    DOC_TARGET: 'Проект документов'
}

const templating = {};
const condKey = 'i_obr_dec'

class IDecisExplorer extends React.Component {

    constructor(props) {
        super(props);
        const fields  = []
        this.state    = {fields};
        this.where    = {};
        this.key      = 0;

        this.conditionGetter = null;
        this.conditionRemover = null;
        this.remove   = this.remove.bind(this);
        this.registerGetSelected = this.registerGetSelected.bind(this);
        this.search = this.search.bind(this);
        this.verify = this.verify.bind(this);
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

    registerGetSelected(outerGetSelected) {
        this.getSelected = outerGetSelected;
    }

    async verify(){
        const orphan = true;
        const selected = this.getSelected();
        const doc_ids = '{'+(selected||[]).map(x=>x.ID).join(',')+'}';        
        const alias = 'APPEAL_VERIFY';
        try{
            const x = await post('db/select',{alias,doc_ids,orphan});
            window.claimMessageAdd('S','Проекты документов проверены');
        } catch (exc){
            window.claimMessageAdd('E',exc);
        }
        this.search();
    }

    search() {
        const s = this.conditionGetter();
        let w = _.chain(s).filter(x=>x.value || x.oper=='NOT NULL' || x.oper=='NULL').value();
        /*if (!_.size(w)){
            window.claimMessageAdd('E','Условие для поиска не задано');
            return;
        }*/

        this.where = w;        
        this.key = 'k' + new Date().getTime();
        this.forceUpdate();
    }

    openRow(rowData, column) {
        const {dispatch, change, initialize} = this.props;
        const alias = 'CLAIM_GET';
        const orphan = true;
        return async () => {
            const claim_id = rowData.CLAIM_ID;
            const x = await post('db/select', {alias, claim_id,orphan});
            dispatch(initialize(im(x.data)));
            const key = window.stateSave();
            const href = window.location.href.replace('/i_check',`/appeal_incoming&storageKey=${key}`);
            window.open(href,'_blank');
        }
    }

    remove() {
        const rlyRem = window.confirm('Вы уверены, что хотите очистить условия?');
        if (!rlyRem) {
            return;
        }
        this.conditionRemover();
    }

    render() {
        const {key,where,state,registerGetSelected,remove} = this;
        const {fields} = state;
        const noTable = this.key == 0;
        const {sid} = this.props;

        const actionCol =  null && {style, body};
        const setGetter = (getter)=>this.conditionGetter = getter;
        const setRemover = (remover) => this.conditionRemover = remover;

        templating['REG_NUM'] = (rowData, column) => (<a onClick={this.openRow(rowData)}>{rowData.REG_NUM}</a>); //

        return (
            <React.Fragment>
                <Layout.Row gutter="0">
                    <Layout.Col span="24">
                        <Card className="box-card sectionCard" header={
                            <div className='headline'>
                                <h3>Поиск ожидающих проверки обращений</h3>
                            </div>
                        }>

                            <SearchRoot {...{fields,setGetter,setRemover,condKey}} />

                            <div className='btns align-t mt18'>
                                <Button type="primary" onClick={this.search}>Искать</Button>
                                <Button type="primary" onClick={this.verify}>Проверить</Button>
                                <Button className="txt-middle ml12" type="text" onClick={remove}>
                                    <i className="ico load align-t mr12"/>
                                        Очистить
                                </Button>
                            </div>
                        </Card>
                    </Layout.Col>
                </Layout.Row>

                { noTable ? <div className='mt60'><h3 className='txt-h3 align-center color-darken10'>Нет результатов поиска</h3></div>
                          : <Card className="box-card" bodyStyle={{ padding: '0' }}>
                                <AppealTable {...{key,sid,desc,actionCol,mapping,templating,where,registerGetSelected}} hdelta={'420'} selectable={true} />
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
)(IDecisExplorer)