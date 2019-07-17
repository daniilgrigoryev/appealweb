import React, {Component} from 'react';
import * as _ from 'lodash'
import {compose} from 'redux'
import {FieldArray, reduxForm} from 'redux-form/immutable'
import AppealTable from './table.js'
import {getSessionId} from '../../selectors/common.js'
import {connect} from 'react-redux'
import {Button, Input, Card, Layout} from 'element-react'
import {post,get} from '../../services/ajax.js'
import {appealLoad} from '../../actions/common.js'
import Immutable from 'immutable'
import {relocate} from '../app/app.js'
import {EInput} from '../components/finput.js'
import {ESelect} from '../components/select.js'
import {EAutocomplete} from '../components/fautocomplete.js'
import {EPicker} from '../components/picker.js'
import {SearchRoot} from '../components/searchRoot.js'
import map from '../../markup/appeal/mapping.js'
import {getCertificates,signXml} from '../../services/crypto.js'
import CryptoSL from '../common/cryptoSigner.js'

const MS = map.status;
const MB = map.basicData;
const MC = map.claimantData;

const timeOfs = new Date().getTimezoneOffset() * 60 * 1000;

const im = (obj) => Immutable.fromJS(obj)

const desc = {
    info_alias: 'i_obr',
    alias: 'APPEAL_SIGN_LIST'
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

const condKey = 'i_obr_sig'

class ISignExplorer extends React.Component {

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
        this.sign = this.sign.bind(this);
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

    sign(cert){
        const orphan = true;
        const alias = 'APPEAL_SIGN';        
        const selected = this.getSelected ();
        const doc_ids = (selected||[]).map(x=>x.ID);
        const sessionId = this.props.sid;

        let errors = 0;

        const getSign = async (ishdoc_id,cert,onDone)=>{
            let sign_error = '';
            let sign_xml = '';
            try {
                const responseXml = await get('storage/pullXml',{ishdoc_id});
                const xml = responseXml.data;
                sign_xml = await signXml(xml,cert);
                
                const info = cert.issuerInfo.split(',').map(x=>x.substring(x.indexOf('=')+1,x.length)).join(' ');
                //const valid = ' действителен с ' + moment(Date.parse(cert.validPeriod.from)).format('DD.MM.YYYY') + ' до ' + moment(Date.parse(cert.validPeriod.to)).format('DD.MM.YYYY');

                const pdfParams = {
                    'sessionId':sessionId,
                    'ishdoc_id':ishdoc_id,
                    'cert_n':cert.serialNumber,
                    'cert_vyd':info,
                    'signedXML': sign_xml 
                }
                
                const responseSignedPdf = await post('storage/stampPdf',pdfParams);
            } catch (exc){
                sign_xml   = 'error';
                sign_error = exc + '';
                errors++;
            }

            try{
                const x  = await post('db/select',{alias,ishdoc_id,sign_xml,sign_error,orphan});
            } catch (err){
                console.error('Sign fix failed',exc);
            }

            onDone && (onDone());   
        }  

        const loop = ()=>{
            const ishdoc_id = doc_ids.pop();
            if (ishdoc_id){
                const size = _.size(doc_ids);
                const msg = size ? ('В очереди на подпись:' + size) : ('Завершение подписи...');
                window.claimMessageAdd('I',msg);
                getSign(ishdoc_id,cert,loop);
            } else { // exit
                let msg = 'Проекты документов подписаны';
                (errors) && (msg += `, ошибок: ${errors}`);
                window.claimMessageAdd('S',msg);
            }
        }

        loop();      
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
            const href = window.location.href.replace('/i_sign',`/appeal_incoming&storageKey=${key}`);
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
                                <h3>Поиск ожидающих подписи обращений</h3>
                            </div>
                        }>
                            <SearchRoot {...{fields,setGetter,setRemover,condKey}} />

                            <div className='btns align-t mt18'>
                                <Button className="txt-middle mx6" type="primary" icon="search" onClick={this.search}>Поиск</Button>
                                <CryptoSL doSign={(cert)=>this.sign(cert)} />
                                <Button className="txt-middle" type="text" onClick={remove}>
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
)(ISignExplorer)