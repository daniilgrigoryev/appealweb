import React, {useRef} from 'react'
import * as _ from 'lodash'
import moment from 'moment'
import { change,formValues } from 'redux-form'
import {Button, Dropdown} from 'element-react'
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
import IshDocsData from './ishDocFile.js'
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
            return moment(Date.parse(data)).format('DD.MM.YYYY');
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

/*

NONE
AWAIT_CHECK
ERROR_CHECK
AWAIT_SIGN
AWAIT_POST
ERROR_SIGN

*/

const IshDocRow = (props) => {
    const {ind, field, value, onRemove, onInfo, onExpand, checkExpand, onFabula, fabData, disabled, claim_id, collapse,fTypes,dispatch,sessionId,initialize,reloadRow} = props;

    const id = value.get('id');
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
    const getSign = async (filename,cert)=>{
        const params = new URLSearchParams();
        params.append('sessionId',sessionId);
        params.append('ishdoc_id',id);
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
        if (hasTopic){
            const menu = <Dropdown.Menu>
                                {fTypes.map(x=><Dropdown.Item key={x.property} command={x.property}>{x.value}</Dropdown.Item>)}
                        </Dropdown.Menu>;

            DOC_MAKER = (
                <React.Fragment>
                    <Dropdown onCommand={commandFabula} menu={menu}>
                        <Button size="small">Создать по шаблону<i className="el-icon-arrow-down el-icon--right"></i></Button>
                    </Dropdown>
                </React.Fragment>);
        } else { //
            DOC_MAKER = (<span>Конструктор шаблонов доступен после связывания документа с темой</span>);
        }
    } //

    if (!expanded) {
        const collapsed = (
            <React.Fragment key={id} >
                <tr>
                    <td>
                        <span className='ap-table-list-number mr12'>{ind + 1}</span>
                    </td>
                    <td>{P.get(M.DOC_TARGET.name)}</td>
                    <td>{P.get(M.ISH_NUM.name)}</td>
                    <td>{data2str(P.get(M.ISH_DATE.name))}</td>
                    <td>{P.get(M.PODPISAL.name)}</td>
                    <td>{P.get(M.STATUS.name)}</td>
                    <td className='pr12 align-r'>
                        {disabled ? null :
                            <Button type="text" onClick={onXpd}>
                                <i className="el-icon-edit color-green"/>
                            </Button>}

                        {disabled ? null :
                            <Button size="small" type="text" onClick={onRmv}>
                                <i className="el-icon-close color-red-dark"/>
                            </Button>}
                    </td>
                </tr>

                <tr>
                    <td colSpan='7'>
                        <hr className='txt-hr my6'/>
                    </td>
                </tr>
            </React.Fragment>
        );
        return [collapsed];
    } //

    const tGetter = ()=>themesLoad(claim_id);

    const setFiles = (immutableFileList)=>{
        let field = 'ish_docs_data['+ind+'].files';
        dispatch(change('appeal',field,immutableFileList));
    }

    const setStatus = (newstatus)=>{
        let field = 'ish_docs_data['+ind+'].status_alias';
        dispatch(change('appeal',field,newstatus));
    }

    const STATUS = ({
        'AWAIT_CHECK' : (<Button onClick={()=>setStatus(null)}>Отмена ожидания проверки</Button>),
        'AWAIT_SIGN'  : (<span>Ожидает подписи</span>),
        'SIGNED'      : (<span>Подписано</span>),
        'SENDED'      : (<span>Отправлено</span>)
    })[status_alias] || (<Button onClick={()=>setStatus('AWAIT_CHECK')} >Передать на проверку</Button>);//

    const editable = (
        <React.Fragment key={id + 'e1'} >
            <tr>
                <td colSpan='7'>
                    <div className='px12 py12 my6 ml-neg12 bg-white border round border--gray-light shadow-darken10'>
                        <table>
                            <tbody>
                            <tr>
                                <td>
                                    <span className='ap-table-list-number mr12'>{ind + 1}</span>
                                </td>
                                <td>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>{M.DOC_TARGET.label}</p>
                                        <Field disabled={disabled} component={FInput} name={field + M.DOC_TARGET.name} />
                                     </span>
                                </td>
                                <td>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>{M.ISH_NUM.label}</p>
                                        <Field disabled={disabled} component={FInput} name={field + M.ISH_NUM.name} />
                                     </span>
                                </td>
                                <td>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>{M.ISH_DATE.label}</p>
                                        <Field disabled={disabled} component={FPicker} name={field + M.ISH_DATE.name} datepicker='+'/>
                                    </span>
                                </td>
                                <td>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>{M.PODPISAL.label}</p>
                                        <Field disabled={true} component={FAutocomplete}  props={{readonly: true}} name={field + M.PODPISAL.name} dataKey={M.PODPISAL.key} />
                                    </span>
                                </td>
                                <td>
                                    <span className='inline-block mr12'>
                                        <p className='ap-table__header'>Проверяющий</p>
                                        <Field disabled={disabled} component={FAutocomplete}  props={{readonly: true}} name={field + 'verifier_id'} dataKey={M.PODPISAL.key} />
                                    </span>
                                </td>
                                <td>
                                    {STATUS}
                                </td>
                                <td>

                                <CryptoSL doSign={(cert)=>getSign(id,cert)} />
                                </td>
                            </tr>
                            <tr key={id + 'e2'}>
                                <td colSpan='6'>
                                    <h4 className='ap-h4'>{M.DETAIL_INF.label}</h4>
                                    <table className='wmax600'>
                                        <tbody>
                                        <tr>
                                            <td className='ap-input-caption'>{M.REL_TOPIC.label}</td>
                                            <td colSpan='3'>
                                                <Field disabled={disabled} component={FAutocomplete} props={{readonly: true}} name={field + M.REL_TOPIC.name} datapromise={tGetter} stoppe='+'/>
                                            </td>                                            
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption'>{M.DOC_VID.label}</td>
                                            <td><Field disabled={disabled} component={FAutocomplete} props={{readonly: true}} name={field + M.DOC_VID.name}  dataKey={M.DOC_VID.key}/></td>
                                            <td className='ap-input-caption'>{M.DELIV_TYPE.label}</td>
                                            <td><Field disabled={disabled} component={FAutocomplete} props={{readonly: true}} name={field + M.DELIV_TYPE.name} dataKey={M.DELIV_TYPE.key}/></td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption'>{M.SHEETS_COUNT.label}</td>
                                            <td><Field disabled={disabled} component={FInput} name={field + M.SHEETS_COUNT.name}   /></td>
                                            <td className='ap-input-caption'>{M.EDO_NUM.label}</td>
                                            <td><Field disabled={disabled} component={FInput} name={field + M.EDO_NUM.name} /></td>
                                        </tr>

                                        <tr>
                                            <td className='ap-input-caption'>{M.COMMENT.label}</td>
                                            <td colSpan='3'><Field disabled={disabled} component={FInput} name={field + M.COMMENT.name} type="textarea"/></td>
                                        </tr>
                                        {false && (<tr>
                                            <td className='ap-input-caption'>Статус проекта документов</td>
                                            <td><Field disabled={disabled} component={FAutocomplete} name={field + 'status'} dataKey='APPEAL_DOC_STAGE' /></td>
                                            <td className='ap-input-caption'>{M.CRYPTO_SIGN.label}</td>
                                            <td><Field disabled={disabled} component={FCheckbox} name={field + M.CRYPTO_SIGN.name} /></td>
                                        </tr>)}
                                        </tbody>
                                    </table>

                                    <hr className='txt-hr my18'/>

                                    <div className='flex-parent flex-parent--center-cross'>
                                        <h4 className="ap-h4 mr18 mb0">{'' && M.FAB_DOC.label}</h4>
                                        {DOC_MAKER}
                                    </div>

                                    <hr className='txt-hr my18'/>
                                    <h4 className="ap-h4">{M.FORMED_DOCS.label}</h4>

                                    <IshDocsData ish_doc_id={id} {...{files,setFiles,fTypes,sessionId,status_alias}}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <hr className='txt-hr my18'/>
                        <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross'>
                            <Button type="text" size="small" onClick={collapse}>
                                <span className='color-blue'>Свернуть</span>
                            </Button>
                            <div>
                                {disabled ? null :
                                    <Button type="text" onClick={onRmv}>
                                        <i className="el-icon-delete color-red-dark"/>
                                    </Button>}
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan='7'>
                    <hr className='txt-hr my18'/>
                </td>
            </tr>
        </React.Fragment>);
    return editable;
} //

export default IshDocRow