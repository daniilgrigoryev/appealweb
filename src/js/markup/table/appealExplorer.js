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
import {baseUrl} from '../../services/api.js'
import * as _ from 'lodash'
import {messageSet} from '../../actions/common.js'

const MS = map.status;
const MB = map.basicData;
const MC = map.claimantData;

const timeOfs = new Date().getTimezoneOffset() * 60 * 1000;

const im = (obj) => Immutable.fromJS(obj)

const desc = {
    info_alias: 'i_obr',
    alias: null // 'APPEAL_LIST' or 'APPEAL_LIST_MY'
}

const style = {textAlign: 'center', width: '8em'};
const mapping = {
    REG_NUM: 'Регистрационный номер',
    DATE_REG: 'Дата регистрации',
    //DATE_CONTROL:'Дата контроля',  
    NAME: 'Заявитель',
    FP_NAME: 'Физ. лицо',
    JP_NAME: 'ЮЛ наименование',
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

        this.registerGetSelected = this.registerGetSelected.bind(this);
        this.conditionGetter = null;
        this.conditionRemover = null;
        this.search   = this.search.bind(this);
        this.searchMy = this.searchMy.bind(this);
        this.getXFile = this.getXFile.bind(this);
        this.remove   = this.remove.bind(this);
        this.checkRemoteCommands = this.checkRemoteCommands.bind(this);
    }

    componentDidMount(){
        this.checkRemoteCommands();
    }

    async checkRemoteCommands(){
        const alias='TABLE_INFO';
        const table_alias= 'i_obr';
        const orphan = true;
        const CS = sessionStorage.getItem('claim_show');
        sessionStorage.removeItem('claim_show');
        if (CS){ // есть внешний запрос на показ Обращения
            const {claim_id,theme_id} = JSON.parse(CS);
            if (claim_id){
                sessionStorage.setItem('show_theme',theme_id);
                this.openRow({ID:claim_id},true)();
            } else if (theme_id) {                
                const alias = 'GET_CLAIM_ID_BY_THEME';
                const x = await post('db/select', {alias, theme_id,orphan})
                const claim_id = parseInt(x.data);
                if (!isNaN(claim_id)){
                    sessionStorage.setItem('show_theme',theme_id);
                    this.openRow({ID:claim_id},true)();
                }
            }
        } else { // внешнего запроса нет - показ таблицы
            const x = await post('db/select',{alias,table_alias,orphan});
            const {data,error} = x;
            if (_.size(data)){
                this.setState({fields:data});   
            }
        }
    }

    openRow(rowData, holdTab) {
        const {dispatch, change, initialize, sid} = this.props;
        const alias = 'CLAIM_GET';
        const orphan = true;
        return async () => {
            const claim_id = rowData.ID;
            const x = await post('db/select', {alias, claim_id,orphan});

            dispatch(initialize(im(x.data)));
            if (holdTab){
                 relocate('appeal_incoming');
            } else {
                const key = window.stateSave();
                const href = window.location.href.replace('/explore',`/appeal_incoming&storageKey=${key}`);
                window.open(href,'_blank');
            }
        }
    }

    search() {
        const s = this.conditionGetter();
        const w = _.chain(s).filter(x=>x.value || x.oper=='NOT NULL' || x.oper=='NULL').value();
        if (!_.size(w)){
            this.key=0;
            window.claimMessageAdd('E','Условие для поиска не задано');
            this.forceUpdate();
            return;
        }
        desc.alias = 'APPEAL_LIST';
        this.where = w;        
        this.key = 'k' + new Date().getTime();
        this.forceUpdate();
    }

    searchMy(){
        const s = this.conditionGetter();
        const w = _.chain(s).filter(x=>x.value || x.oper=='NOT NULL' || x.oper=='NULL').value();
       
        desc.alias = 'APPEAL_LIST_MY';
        this.where = w;        
        this.key = 'k' + new Date().getTime();
        this.forceUpdate();        
    }

    remove() {
        const rlyRem = window.confirm('Вы уверены, что хотите очистить условия?');
        if (!rlyRem) {
            return;
        }
        this.conditionRemover();
    }

    getXFile() {
        const alias = 'I_CLAIM_EXCEL_LIST';
        const {sid} = this.props;
        const selected = this.getSelected();
        if (_.isEmpty(selected)) {
            const msg = 'Ни одна запись не выбрана';
            messageSet(msg, 'error');             
            console.error(msg);
            return;
        }
        const doc_ids = '{'+(selected||[]).map(x=>x.ID).join(',')+'}';     

        const params = new URLSearchParams();
        params.append('sessionId',sid);
        params.append('doc_ids', doc_ids);
        params.append('alias', alias);

        const path = 'xls/fill?'; 
        const tempLink = document.createElement('a');

        var event = document.createEvent('MouseEvents');
            event.initMouseEvent(
              'click', true, false, window, 0, 0, 0, 0, 0
              , false, false, false, false, 0, null
            );

        tempLink.href = baseUrl() + path + params.toString();
        tempLink.setAttribute('download', 'test.xls');
        tempLink.dispatchEvent(event);
        setTimeout(()=>(tempLink && (tempLink.remove())),5000);
    }

    registerGetSelected(outerGetSelected) {
        this.getSelected = outerGetSelected;
        this.forceUpdate();
    }

    render() {
        const {key,where,state,registerGetSelected, remove} = this;
        const {fields} = state;
        const noTable = this.key == 0;
        const {sid} = this.props;

        templating['REG_NUM'] = (rowData, column) => (<a onClick={this.openRow(rowData)}>{rowData.REG_NUM}</a>); //

        const actionCol  =  null && {style, body};
        const setGetter  = (getter) => this.conditionGetter = getter;
        const setRemover = (remover) => this.conditionRemover = remover;

        return (<React.Fragment>

                <Card className="box-card sectionCard" header={
                    <div className="headline">
                        <h3>Поиск обращений</h3>
                    </div>
                }>
                <SearchRoot {...{fields,setGetter,setRemover}}/>
                <div className='btns align-t mt18'>
                    <Button className="txt-middle mx6" type="primary" icon="search" onClick={this.search}>Поиск</Button>
                    <Button className="txt-middle mx6" type="primary" icon="search" onClick={this.searchMy}>Поиск среди своих</Button>
                    {!noTable && (<Button className="txt-middle mx6"  type="primary" onClick={this.getXFile}>xls</Button>)}
                    <Button className="txt-middle" type="text" onClick={remove}>
                        <i className="ico load align-t mr12"/>
                        Очистить
                    </Button>
                </div>
                </Card>

                { noTable ? <div className='mt60'><h3 className='txt-h3 align-center color-darken10'>Нет результатов поиска</h3></div>
                          : <Card className="box-card" bodyStyle={{ padding: '0' }}>
                                <AppealTable {...{key,sid,desc,actionCol,mapping,templating,where, registerGetSelected}} hdelta={'515'}  selectable={true} />
                            </Card>}
            </React.Fragment>);
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