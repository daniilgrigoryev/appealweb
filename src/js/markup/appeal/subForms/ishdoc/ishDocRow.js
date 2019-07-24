import React, {useRef} from 'react'
import * as _ from 'lodash'
import moment from 'moment'
import { change,formValues } from 'redux-form'
import {Button, Dropdown, Card} from 'element-react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../../components/finput.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import {ECheckbox, FCheckbox} from '../../../components/checkbox.js'
import {FAutocomplete} from '../../../components/fautocomplete.js'
import {getAc} from '../../../../services/acCacher.js'
import FabulaDialog from '../fabulaDialog.js'
import mapping from '../../mapping.js'
import {post,postFile,mpt,get} from '../../../../services/ajax.js'
import {getSessionId, getSystem} from '../../../../selectors/common.js'
import Immutable from 'immutable'
import FilesStorage from '../../../components/filesStorage.js'
import {baseUrl} from '../../../../services/api.js'
import {getCertificates,signXml} from '../../../../services/crypto.js'
import CryptoSL from '../../../common/cryptoSigner.js'

const M = mapping.ishDocList;

const blob2user = (blob,filename)=>{
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    try {
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = fileName;
        a.click();
    } finally {
        setTimeout(()=>{
            window.URL.revokeObjectURL(url);
            a && (a.remove());
        },1000);
    }
}

const data2str = (data) =>{
    if (typeof data == 'string'){
        try{
            return moment(Date.parse(data.replace(/"|'/g, ''))).format('DD.MM.YYYY');
        } catch(e){}
    }

    if (data){
        return (data instanceof Date) ? data.toISOString() : data; 
    }
    return '';
} 

const stopPg = (cb, id) => (evt) => {
    evt.stopPropagation();
    cb(id);
    return false;
}

const themesLoad = (claim_id)=>post("db/select",{alias : 'CLAIM_THEMES_BY_ID', listValueField : 'value', claim_id});

const IshDocRow = React.memo(props => {
    const {ind, field, value, onRemove, onInfo, onExpand, checkExpand, onFabula, fabData, claim_id, collapse,fTypes,dispatch,sessionId,initialize,reloadRow,noChanges} = props;
    let {disabled} = props;
    const id = value.get('id');
    const ver_id = value.get('verifier_id');
    const showBtn = id && ver_id;
    const related_topic = value.get('linked_theme_id');
    const files = value.get('files');
    const status_alias = value.get('status_alias');
    const status_eval = value.get('status_eval');
    const expanded = checkExpand(ind);
    const onRmv = stopPg(onRemove, ind);
    const onInf = stopPg(onInfo, id);
    const onXpd = () => onExpand(ind);
    const commandFabula = (type, el) => onFabula(type, fabData,related_topic,id);

    const linkingThemes = props.categories;
    const P = value;

    const prop_disabled = disabled;
    disabled = disabled || !!status_alias; // при любом из установленных статусов (ожидает проверки, ожидает подписи, подписано (ожидает отправки), отправлено) редактирование запрещено
    
    const headerTable = (
        <div className="row" style={{'padding-left': '80px'}}>
            <div className="column w180">
                <div className="label">{M.DOC_TARGET.label}</div>
            </div>
            <div className="column w180">
                <div className="label">{M.ISH_DATE.label}</div>
            </div>
            <div className="column w180">
                <div className="label">Подписант</div>
            </div>
            <div className="column">
                <div className="label">Статус</div>
            </div>
        </div>
    );



    if (!expanded) { // collapsed
        return (
            <React.Fragment>
                {!ind ? headerTable : null}
                <div className="row row--editable" key={id} onClick={onXpd}>
                    <div className="column w60">
                        <div className="value">
                            <span className="list-num">{ind + 1}</span>
                        </div>
                    </div>
                    <div className="column w180">
                        <div className="value">
                            {P.get(M.DOC_TARGET.name)
                                ? <span>{P.get(M.DOC_TARGET.name)}</span> 
                                : <span className="txt-middle color-gray-light">[не заполнено]</span>
                            }
                        </div>
                    </div>
                    <div className="column w180">
                        <div className="value">
                            {data2str(P.get(M.ISH_DATE.name)) 
                                ? <span>{data2str(P.get(M.ISH_DATE.name))}</span> 
                                : <span className="txt-middle color-gray-light">[не заполнено]</span>
                            }
                        </div>
                    </div>
                    <div className="column w180">
                        <div className="value">
                            {P.get('podpisal_name')
                                ? <span>{P.get('podpisal_name')}</span> 
                                : <span className="txt-middle color-gray-light">[не заполнено]</span>
                            }
                        </div>
                    </div>
                    <div className="column">
                        <div className="value">
                            {P.get('status_name') || 'Черновик'}
                        </div>
                    </div>
                    <div className="column column--end">
                        <div className="value mt0">
                            {disabled ? null :
                            <Button size="small" type="text" onClick={onRmv}>
                                <i className="ico round minus"/>
                            </Button>}
                            <Button type="text" onClick={onXpd}>
                                <i className="ico round edit"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </React.Fragment>


              

            /* <div className="wrap wrap--infoview">
                <div className="left-aside">
                    <div className="list-num mr12">{ind + 1}</div>
                </div>
                <div className="right-aside">
                    {disabled ? null :
                        <Button size="small" type="text" onClick={onRmv}>
                            <i className="ico round minus"/>
                        </Button>
                    }
                    <Button type="text" onClick={onXpd}>
                        <i className="ico round edit"/>
                    </Button>
                </div>
                <div className="item">
                    <small className="label">{M.DOC_TARGET.label}</small>
                    <div className="value">
                        {P.get(M.DOC_TARGET.name)}
                    </div>
                </div>
                <div className="item">
                    <small className="label">{M.ISH_DATE.label}</small>
                    <div className="value">
                        {data2str(P.get(M.ISH_DATE.name)) 
                            ? <span>{data2str(P.get(M.ISH_DATE.name))}</span> 
                            : <span className="txt-middle color-gray-light">[не заполнено]</span>
                        }
                    </div>
                </div>
                <div className="item">
                    <small className="label">Подписант</small>
                    <div className="value">
                        {P.get('podpisal_name')
                            ? <span>{P.get('podpisal_name')}</span> 
                            : <span className="txt-middle color-gray-light">[не заполнено]</span>
                        }
                    </div>
                </div>
                <div className="item">
                    <small className="label">Статус</small>
                    <div className="value">
                        {P.get('status_name') || 'Черновик'}
                    </div>
                </div>
            </div> */
        );
    } //

    const getSign = async (filename,cert)=>{
        const responseXml = await get('storage/pullXml',{ishdoc_id:id});
        const xml = responseXml.data;
        const signature = await signXml(xml,cert);

        const info = cert.issuerInfo.split(',').map(x=>x.substring(x.indexOf('=')+1,x.length)).join(' ');
        //const valid = ' действителен с ' + moment(Date.parse(cert.validPeriod.from)).format('DD.MM.YYYY') + ' до ' + moment(Date.parse(cert.validPeriod.to)).format('DD.MM.YYYY');

        const pdfParams = {
            'sessionId':sessionId,
            'ishdoc_id':id,
            'cert_n':cert.serialNumber,
            'cert_vyd':info,
            'signedXML': signature 
        }
        const responseSignedPdf = await post('storage/stampPdf',pdfParams);
     
        reloadRow();   
    }
    
    const hasTopic = !_.isEmpty(related_topic);
    let DOC_MAKER = null;
    if (!disabled){
        if (hasTopic && noChanges){
            const menu = <Dropdown.Menu>
                                {fTypes.map(x=><Dropdown.Item key={x.property} command={x.property}>{x.value}</Dropdown.Item>)}
                        </Dropdown.Menu>;

            DOC_MAKER = <Dropdown onCommand={commandFabula} menu={menu} className="mx-auto my18">
                        <Button size="small">Создать по шаблону<i className="el-icon-arrow-down el-icon--right"></i></Button>
                    </Dropdown>;
        } else { //
            DOC_MAKER = (
                <div className="flex-parent flex-parent--center-main flex-parent--column w-full">
                    <i className="ico round info w30 h30 mx-auto mt18"/>
                    <p className="my6 mb18 txt-em color-gray align-center">
                        Конструктор шаблонов доступен после связывания документа с темой и отсутствии несохраненных изменений 
                    </p>
                </div>
            );;
        }
    } //

    const tGetter = ()=>themesLoad(claim_id);

    const setFiles = (immutableFileList)=>{
        let field = 'ish_docs_data['+ind+'].files';
        dispatch(change('appeal',field,immutableFileList));
    }

    const setCheckSt = (newstatus) => {
        post("db/select",{alias: 'SET_CHECK_STATUS', id: id, status_alias: newstatus, orphan: true})
            .then(x => (x.data && +x.data > 0 && reloadRow()))
            .catch(x => {
                messageSet(x, 'error');
                console.error(x);
            });
        let field = 'ish_docs_data['+ind+'].status_alias';
        dispatch(change('appeal',field,newstatus));
    } //

    const await_c = !showBtn ? null : (<Button size="small" onClick={()=>setCheckSt('REVOKE_CHECK')}>Отмена ожидания проверки</Button>);
    const await_s = (<Button onClick={()=>setCheckSt('REVOKE_SIGN')}>Ожидает подписи. Отказ от подписи</Button>);
    const signd = (<React.Fragment> 
        <span>Подписано</span>
        <Button size="small" onClick={()=>setCheckSt('SENDED')} >Отправлено вручную</Button>
        <Button size="small" onClick={()=>setCheckSt('SEND_QUEUE')} >АВТО отправка</Button>
    </React.Fragment>);
    const sendd = <span>Отправлено</span>;
    const nostat = !showBtn ? null : (
        <React.Fragment>
            <Button size="small" onClick={()=>setCheckSt('AWAIT_CHECK')} >На проверку (ЭЦП)</Button>
            <Button size="small" onClick={()=>setCheckSt('SIGNED')} >Подписано вручную</Button>
            <Button size="small" onClick={()=>setCheckSt('NO_SIGN_NEEDS')} >Без подписи</Button>
        </React.Fragment>);

    const STATUS = ({
        'AWAIT_CHECK' : await_c,
        'AWAIT_SIGN'  : await_s,
        'SIGNED'      : signd,
        'SENDED'      : sendd
    })[status_alias] || nostat; //

    const editable = (
        <div className="shadow-darken10" style={{'border':'1px solid #CCC'}} key={id + 'e1'} >
            <Card className="box-card sectionCard" header={
                <div className='headline'>
                    <h3>Основные сведения</h3>
                </div>
            }>
                <div className="form-container">
                    <div className="wrap">
                        <div className="item">
                            <small className="label">{M.DOC_TARGET.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FInput} name={field + M.DOC_TARGET.name} />
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">{M.ISH_NUM.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FInput} name={field + M.ISH_NUM.name} />
                            </div>
                        </div>
                        <div className="item item--right">
                            <small className="label">{M.ISH_DATE.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FPicker} name={field + M.ISH_DATE.name} datepicker='+'/>
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">{M.PODPISAL.label}</small>
                            <div className="value">
                                <Field disabled={true} component={FInput} name={field + 'podpisal_name'} />
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">Проверяющий</small>
                            <div className="value">
                                <Field disabled={disabled || !_.isEmpty(status_alias)} component={FAutocomplete} name={field + 'verifier_id'} dataKey={M.PODPISAL.key} dbVisibleVal={value.get('verifier_name')} />
                            </div>
                        </div>
                        <div className="item" style={{'display': 'flex','flexDirection': 'row'}}>
                            {(prop_disabled || !noChanges) ? null : STATUS}
                        </div>
                        <div className="item">
                            {(disabled || status_alias != 'AWAIT_SIGN') ? null : (<CryptoSL doSign={(cert)=>getSign(id,cert)} />) }
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="box-card sectionCard" header={
                <div className='headline'>
                    <h3>{M.DETAIL_INF.label}</h3>
                </div>
            }>
                <div className="form-container">
                    <div className="wrap" key={id + 'e2'}>
                        <div className="item">
                            <small className="label">{M.DOC_VID.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FAutocomplete} name={field + M.DOC_VID.name}  dataKey={M.DOC_VID.key}/>
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">{M.SHEETS_COUNT.label}</small>
                            <div className="value w60">
                                <Field disabled={disabled} component={FInput} name={field + M.SHEETS_COUNT.name}/>
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">{M.REL_TOPIC.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FAutocomplete} name={field + M.REL_TOPIC.name} datapromise={tGetter} stoppe='+'/>
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">{M.DELIV_TYPE.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FAutocomplete} name={field + M.DELIV_TYPE.name} dataKey={M.DELIV_TYPE.key}/>
                            </div>
                        </div>

                        <div className="item">
                            <small className="label">{M.EDO_NUM.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FInput} name={field + M.EDO_NUM.name} />
                            </div>
                        </div>
                        <div className="item item--right">
                            <small className="label">{M.COMMENT.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FInput} name={field + M.COMMENT.name} type="textarea"/>
                            </div>
                        </div>
                        {false && <div className="item item--left">
                            <small className="label">{M.CRYPTO_SIGN.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FCheckbox} name={field + M.CRYPTO_SIGN.name} />
                            </div>
                        </div>}
                    </div>
                </div>
            </Card>

            <div className='flex-parent flex-parent--center-cross'>
                <h4 className="ap-h4 mr18 mb0">{'' && M.FAB_DOC.label}</h4>
                {DOC_MAKER}
            </div>

            <Card className="box-card sectionCard" bodyStyle={{'padding': 0}} header={
                <div className='headline'>
                    <h3>{M.FORMED_DOCS.label}</h3>
                </div>
            }>
                <div className="form-container">
                    <FilesStorage {...{files,setFiles,fTypes,sessionId,status_alias,disabled}} />
                </div>
            </Card>

            <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross bg-white px18 py12'>
                <div>
                    {disabled ? null : <Button type="text" onClick={onRmv}>
                        <i className="el-icon-delete color-red-dark" style={{'fontSize': '18px'}}/>
                    </Button>}
                </div>


                <Button type="primary" size="small" onClick={collapse}>
                    <span>Свернуть</span>
                </Button>
            </div>

        </div>);
    return editable;
}) //

export default IshDocRow
