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
import {messageSet} from '../../actions/common.js'
import * as _ from 'lodash'

const MS = map.status;
const MB = map.basicData;
const MC = map.claimantData;

const timeOfs = new Date().getTimezoneOffset() * 60 * 1000;

const im = (obj) => Immutable.fromJS(obj)

const desc = {
    info_alias: 'o_obr',
    alias: 'APPEAL_OUT_LIST'
}

const style = {textAlign: 'center', width: '8em'};
const mapping = {
    REG_NUM: 'Регистрационный номер',
    DATE_REG: 'Дата регистрации',
    //DATE_CONTROL:'Дата контроля',  
    NAME: 'Заявитель',
    ISP_NAME: 'Исполнитель',
    //ISP_OTD: 'Отдел'
}

const templating = {};

class AppealOutExplorer extends React.Component {

    constructor(props) {
        super(props);
        const fields  = []
        this.state    = {fields};
        this.where    = {};
        this.key      = 0;
        this.registerGetSelected = this.registerGetSelected.bind(this);
        this.getXFile = this.getXFile.bind(this);
        this.conditionGetter = null;
        this.search   = this.search.bind(this);
    }

    componentDidMount(){
        const alias='TABLE_INFO';
        const table_alias= 'o_obr';
        const orphan = true;
        post('db/select',{alias,table_alias,orphan}).then(x=>{
            const {data,error} = x;
            if (_.size(data)){
                this.setState({fields:data});   
            }
        })
    }

    getXFile() {
        const alias = 'O_CLAIM_EXCEL_LIST';
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
        tempLink.href = baseUrl() + path + params.toString();
        tempLink.setAttribute('download', 'test.xls');
        tempLink.click();
        setTimeout(()=>(tempLink && (tempLink.remove())),5000);

    }

    registerGetSelected(outerGetSelected) {
        this.getSelected = outerGetSelected;
    }

    openRow(rowData, column) {
        const {dispatch, change, initialize} = this.props;
        const alias = 'CLAIM_OUT_GET';
        const orphan = true;
        return async () => {
            const claim_id = rowData.ID;
            const x = await post('db/select', {alias, claim_id,orphan});

            dispatch(initialize(im(x.data)));
            const key = window.stateSave();
            const href = window.location.href.replace('/explore_out',`/appeal_outgoing&storageKey=${key}`);
            window.open(href,'_blank');
        }
    }

    search() {
        const s = this.conditionGetter();
        const w = _.chain(s).filter(x=>x.value || x.oper=='NOT NULL' || x.oper=='NULL').value();
        if (!_.size(w)){
            window.claimMessageAdd('E','Условие для поиска не задано');
            return;
        }

        this.where = w;        
        this.key = 'k' + new Date().getTime();
        this.forceUpdate();
    }

    render() {
        const {key,where,state,registerGetSelected} = this;
        const {fields} = state;
        const noTable = _.isEmpty(where);
        const {sid} = this.props;

        templating['REG_NUM'] = (rowData, column) => (<a onClick={this.openRow(rowData)}>{rowData.REG_NUM}</a>); //


        const actionCol =  null && {style, body};
        const setGetter = (getter)=>this.conditionGetter = getter;

        return (
            <React.Fragment>
                <Layout.Row gutter="0">
                    <Layout.Col span="24">
                        <Card bodyStyle={{ padding: '0' }} className="box-card scroll-styled scroll-auto" header={
                            <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                                <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                    Поиск исходящих обращений
                                </h3>
                            </div>
                        }>
                            <div className="view-data__container pl18 py12">
                                <SearchRoot {...{fields,setGetter}} />
                                <div className='inline-block align-t mt12 ml12'>
                                    <Button type="primary" onClick={this.search}>Искать</Button>
                                    {!noTable && (<Button type="primary" onClick={this.getXFile}>xls</Button>)}
                                </div>
                            </div>
                        </Card>
                    </Layout.Col>
                </Layout.Row>

                { noTable ? <div className='mt60'><h3 className='txt-h3 align-center color-darken10'>Нет результатов поиска</h3></div>
                          : <Card className="box-card" bodyStyle={{ padding: '0' }}>
                                <AppealTable {...{key,sid,desc,actionCol,mapping,templating,where,registerGetSelected}} hdelta={'515'} selectable={true}/>
                            </Card>}
            </React.Fragment>
        )
    } //
}

const state2props = (state) =>({sid: getSessionId(state)})

export default compose(
    connect(state2props),
    reduxForm({
        form: 'outgoing', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
        enableReinitialize: true
        //validate
    })
)(AppealOutExplorer)