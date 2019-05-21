import * as _ from 'lodash'
import moment from 'moment'
import Immutable from 'immutable'
import React, { useState,useRef } from 'react'
import {Button, Card, Layout, Tag, Switch} from 'element-react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import { change } from 'redux-form'
import AddressData2, {getAdrKey} from '../../../common/addressData2.js' 
import {EInput, FInput} from '../../../components/finput.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import {ECheckbox, FCheckbox} from '../../../components/checkbox.js'
import {EAutocomplete, FAutocomplete} from '../../../components/fautocomplete.js'
import {getAc} from '../../../../services/acCacher.js'
import {fields, categories, matrix} from '../../categories.js'
import {post} from '../../../../services/ajax.js'
import {messageSet} from '../../../../actions/common.js'
import mapping from '../../mapping.js'
import TopicDocs from  './topicDocs.js'

const hashCode = (s)=>(s||"").split("").reduce((a,b)=>(a=((a<<5)-a)+b.charCodeAt(0), a&a),0);            

const M = mapping.topicList;
const M_STATUS = mapping.status;

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

class TopicRow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            manualPostLink: false
        }
    }

    setManualPostLink(manualPostLink){
        this.setState({manualPostLink});
    }

    render(){
        const {manualPostLink} = this.state;
        const {ind, field, value, onChange, onRemove, onInfo, onExpand, checkExpand, disabled,collapse,claim_id,dispatch,apn_list,sessionId} = this.props;
        
        const fldN = field + M.POST_N.name;
        const fldD = field + M.POST_DATE.name;
        const fldLinkedID = field + "post_decree_id";
        const fldLinkedNN = field + "post_decree_n";
        const fldLinkedDD = field + "post_decree_date";

        const id            = value.get('id');
        const apn_post_n    = value.get('post_n');
        const apn_post_date = value.get('post_date');
        const post_id       = value.get('post_id');
        const decree_id     = value.get("post_decree_id");
        const post_decree_n = value.get('post_decree_n');
        const post_decree_date = value.get('post_decree_date');
        const filesRows        = value.get('theme_files');

        const dateL = moment(post_decree_date).format("MMM Do YY");
        const dateP = moment(apn_post_date).format("MMM Do YY");

        const linkedPost = !decree_id ? false : (post_decree_n==apn_post_n && dateL == dateP);      
        const linkDecree = async ()=>{
            const orphan = true;
            const resp = await post("db/select",{alias : 'LINK_DECREE', apn_post_n,apn_post_date,orphan});
            const {data,error} = resp;
            if (error || data==''){
                console.error('linkDecree error:', error || 'No suitable record found');
                dispatch(change('appeal', fldLinkedID, null));            
                messageSet('Не удалось найти постановление в АДМ','error');
                return;
            }
            dispatch(change('appeal', fldLinkedID,(''+data)));            
            dispatch(change('appeal', fldLinkedNN,apn_post_n));
            dispatch(change('appeal', fldLinkedDD,apn_post_date));            
            messageSet('Связано с постановлением в АДМ','success');    
        }

        let LinkerBTN = (<span>Невозможно связать с АДМ</span>); //
        if (apn_post_date && (apn_post_n || post_id)){
            LinkerBTN = !linkedPost 
                 ? (<Button onClick={linkDecree}>Связать с АДМ</Button>)
                 : (<span>Связано с АДМ</span>); //
        }

        const apnPromise = ()=>post("db/select",{alias : 'APN', listValueField : 'value', id: claim_id});
        
        const expanded = checkExpand(ind);
        const onRmv = stopPg(onRemove, ind);
        const onInf = stopPg(onInfo, id);

        const onXpd = () => onExpand(ind);
        const P = value;

        const SYS = 'M';
        const FF = fields, FFF = FF.map(x => x.field), CC = categories, CCF = categories.filter(x => x), MM = matrix;

        const CCC = CC.filter(x => x && x.sys.indexOf(SYS) > -1).map(x => x.text);
        const cIndex = CCC.indexOf(P[M.CAT.name]);
        const cRow = MM[cIndex+1]; // lead row offset

        const cif = (field, el) => {
            if (true){
                return el;
            }
            if (!cRow) {
                return null;
            }
            const fIndex = FFF.indexOf(field);
            return !!cRow[fIndex] ? el : null;
        };

        if (!expanded) {
            const collapsed = (
                <React.Fragment key={id} >
                    <tr>
                        <td>
                            <span className='ap-table-list-number mr12'>{ind + 1}</span>
                        </td>
                        <td>
                            <span className='inline-block mr12'>{this.props.getValue(P.get(M.CAT.name))}</span>
                        </td>
                        <td>
                            <span className='inline-block mr12'>{P.get(M.POST_N.name)}</span>
                        </td>
                        <td>
                            <span className='inline-block mr12'>{data2str(P.get(M.POST_DATE.name))}</span>
                        </td>
                        <td colSpan='2' className='pr12 align-r'>
                           <span className="ml12">
                               {disabled ? null : <Button type="text" onClick={onXpd}><i className="el-icon-edit color-green"/></Button>}
                               {disabled ? null : <Button type="text" onClick={onInf}><i className="el-icon-information color-blue"/></Button>}
                               {disabled ? null : <Button size="small" type="text" onClick={onRmv}><i className="el-icon-close color-red-dark"/></Button>}
                           </span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='6'>
                            <hr className='txt-hr my18'/>
                        </td>
                    </tr>
                </React.Fragment>);
            return [collapsed];
        } //

        const PRIS_UCH = (!P.get(M.UCH_PRIS.name)) ? null : (<React.Fragment>
            <tr>
                <td className='ap-input-caption'>{M.RASSMOTR_DATE.label}</td>
                <td>
                    <Field disabled={disabled} component={FPicker} name={field + M.RASSMOTR_DATE.name} value={P[M.RASSMOTR_DATE.name]} datetimepicker='+'/>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <Button type="text" size="small">
                        <span className='color-blue'>Зарезервировать слот в СУО</span>
                    </Button>
                </td>
            </tr>
        </React.Fragment>);
    //
        const postSelect = (args)=>{ // подсос даты
            const AL = apn_list;
            const newDateStr = _.chain(AL.toJS()||[]).filter(x=>+x.apn==+args.key).first().get('date').value();
            const newVal = !newDateStr ? null : new Date(Date.parse(newDateStr));
            dispatch(change(`appeal`, fldD, newVal));
        }

        const postClear = ()=>{
            dispatch(change(`appeal`, fldN, null));
            dispatch(change(`appeal`, fldD, null));
            dispatch(change('appeal', fldLinkedID, null));
        }

        const dispatchForm = (fieldName,fieldVal)=>dispatch(change('appeal',fieldName,fieldVal));

        const editable =
            <React.Fragment key={id + 'e1'}>
                <tr>
                    <td colSpan='6'>
                        <div className='px12 py12 my6 ml-neg12 bg-white border round border--gray-light shadow-darken10'>
                            <table>{/* className='wmax600' */}
                                <tbody>
                                <tr>
                                    <td>
                                        <span className='ap-table-list-number mr12'>{ind + 1}</span>
                                    </td>
                                    <td>
                                        <span className='inline-block mr12'>
                                            <Field disabled={disabled} component={FAutocomplete} name={field + M.CAT.name}
                                                   placeholder={M.CAT.label}
                                                   dataKey={M.CAT.key} value={P[M.CAT.name]}/>
                                        </span>
                                    </td>

                                    {manualPostLink
                                        ? (<td>
                                             <span className='inline-block mr12 w240'>
                                                <Field disabled={disabled} component={FInput} name={field + M.POST_N.name}
                                                       placeholder={M.POST_N.label}
                                                       value={P[M.POST_N.name]}/>
                                             </span>
                                            </td>)
                                        : (<td>
                                            <span className='inline-block mr12 w240'>
                                                <Field disabled={disabled} component={FAutocomplete} name={field + M.POST_N.name}
                                                       placeholder={M.POST_N.label} onSelect={postSelect}
                                                       datapromise={apnPromise} value={P[M.POST_N.name]}/>
                                             </span>
                                            </td>)}                                

                                    <td>
                                        <span className='inline-block mr12 w240'>
                                            <Field disabled={!manualPostLink} isDisabled={!manualPostLink} component={FPicker}
                                                name={field + M.POST_DATE.name} placeholder={M.POST_DATE.label} value={P[M.POST_DATE.name]} datepicker='+'/>
                                        </span>
                                    </td>
                                    <td>
                                         <Switch
                                            value={manualPostLink}
                                            onValue={true}
                                            offValue={false}
                                            onText='РУЧН'
                                            offText='АВТ'
                                            onChange={(value)=>{
                                                this.setManualPostLink(value);
                                                postClear(); 
                                            }}>
                                          </Switch>
                                    </td>
                                    <td className='ap-input-caption w120'>Ручной ввод</td>
                                    <td>{LinkerBTN}</td>
                                </tr>

                                <tr>
                                    <td colSpan='7'>
                                        <h4 className="ap-h4">Детальная информация по теме</h4>
                                    </td>
                                </tr>

                                <tr key={id + 'e2'}>
                                    <td colSpan='6'>
                                        <table>
                                            <tbody>
                                            <tr>
                                                <td className='ap-input-caption'>Исполнитель</td>
                                                <td><Field disabled={disabled} component={FAutocomplete} name={field + 'executor_id'} dataKey={M_STATUS.EXECUTOR.key} /></td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>Отдел исполнителя</td>
                                                <td><Field disabled={disabled} component={FAutocomplete} name={field + 'executor_org_id'} dataKey={M_STATUS.DEPART.key} /></td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>Статус по теме</td>
                                                <td><Field disabled={disabled} component={FAutocomplete} name={field + 'stage_id'} dataKey='THEME_STATUS' /></td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>Дата контроля</td>
                                                <td><Field disabled={disabled} component={FPicker} name={field + 'control_date'} datepicker='+' /></td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>{M.REL_DOCS.label}</td>
                                                <td className='ap-input ap-input--disabled'>
                                                    <TopicDocs rows={filesRows} sessionId={sessionId} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>{M.UCH_PRIS.label}</td>
                                                <td><Field disabled={disabled} component={FCheckbox} value={P[M.UCH_PRIS.name]} name={field + M.UCH_PRIS.name}/></td>
                                            </tr>

                                            {PRIS_UCH}

                                            {cif(M.CODEX_ARTICLE.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.CODEX_ARTICLE.label}</td>
                                                    <td><Field disabled={disabled} component={FInput} value={P[M.CODEX_ARTICLE.name]} name={field + M.CODEX_ARTICLE.name}/></td>
                                                </tr>)
                                            )}
                                            {cif(M.OWNER_TS.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.OWNER_TS.label}</td>
                                                    <td><Field disabled={disabled} component={FInput} value={P[M.OWNER_TS.name]} name={field + M.OWNER_TS.name}/></td>
                                                </tr>)
                                            )}
                                            {cif(M.OWNER_TS_ADR.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.OWNER_TS_ADR.label}</td>
                                                    <td><AddressData2 key={getAdrKey(value,['owner_ts_adr_id','owner_ts_adr_kvart'])} dispatchForm={dispatchForm} source={value} rootField={field} fields={['owner_ts_adr_id','owner_ts_adr_kvart','owner_ts_adr_line']}>
                                                            {value.get('owner_ts_adr_line') || ''}
                                                        </AddressData2>
                                                    </td>
                                                </tr>)
                                            )}
                                            {cif(M.APN_ADR.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.APN_ADR.label}</td>
                                                    <td><AddressData2 key={getAdrKey(value,['apn_adr_id','apn_adr_kvart'])} dispatchForm={dispatchForm} source={value} rootField={field} fields={['apn_adr_id','apn_adr_kvart','apn_adr_line']} >
                                                        {value.get('apn_adr_line') || ''}
                                                        </AddressData2>
                                                    </td>
                                                </tr>)
                                            )}
                                            {cif(M.APN_DATA.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.APN_DATA.label}</td>
                                                    <td><Field disabled={disabled} component={FPicker} value={P[M.APN_DATA.name]} name={field + M.APN_DATA.name} datepicker='+'/></td>
                                                </tr>)
                                            )}
                                            {cif(M.DESCRIPTION.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.DESCRIPTION.label}</td>
                                                    <td><Field disabled={disabled} component={FInput} value={P[M.DESCRIPTION.name]} name={field + M.DESCRIPTION.name} type="textarea"/></td>
                                                </tr>)
                                            )}
                                            {cif(M.DECISION_DATE.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.DECISION_DATE.label}</td>
                                                    <td><Field disabled={disabled} component={FPicker} value={P[M.DECISION_DATE.name]} name={field + M.DECISION_DATE.name} datepicker='+'/></td>
                                                </tr>)
                                            )}
                                            {cif(M.VIOLATOR_REGNO.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.VIOLATOR_REGNO.label}</td>
                                                    <td><Field disabled={disabled} component={FInput} value={P[M.VIOLATOR_REGNO.name]} name={field + M.VIOLATOR_REGNO.name}/></td>
                                                </tr>)
                                            )}
                                            {cif(M.APPEAL_CAUSE.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.APPEAL_CAUSE.label}</td>
                                                    <td><Field disabled={disabled} component={FAutocomplete} value={P[M.APPEAL_CAUSE.name]} name={field + M.APPEAL_CAUSE.name} dataKey={M.APPEAL_CAUSE.key}/>
                                                    </td>
                                                </tr>)
                                            )}
                                            {cif(M.DESISION_MAKER.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.DESISION_MAKER.label}</td>
                                                    <td><Field disabled={disabled} component={FAutocomplete} value={P[M.DESISION_MAKER.name]} name={field + M.DESISION_MAKER.name} dataKey={M.DESISION_MAKER.key} />
                                                    </td>
                                                </tr>)
                                            )}
                                            {cif(M.DECISION_THEME.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.DECISION_THEME.label}</td>
                                                    <td><Field disabled={disabled} component={FAutocomplete} value={P[M.DECISION_THEME.name]} name={field + M.DECISION_THEME.name} dataKey={M.DECISION_THEME.key}/>
                                                    </td>
                                                </tr>)
                                            )}
                                            {cif(M.DECISION_BASIS.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.DECISION_BASIS.label}</td>
                                                    <td><Field disabled={disabled} component={FAutocomplete} value={P[M.DECISION_BASIS.name]} name={field + M.DECISION_BASIS.name} dataKey={M.DECISION_BASIS.key}/>
                                                    </td>
                                                </tr>)
                                            )}
                                            {cif(M.POST_APPEAL_CAUSE.name,
                                                (false && <tr>
                                                    <td className='ap-input-caption'>{M.POST_APPEAL_CAUSE.label}</td>
                                                    <td><Field disabled={disabled} component={FAutocomplete} value={P[M.POST_APPEAL_CAUSE.name]} name={field + M.POST_APPEAL_CAUSE.name} dataKey={M.POST_APPEAL_CAUSE.key}/>
                                                    </td>
                                                </tr>)
                                            )}
                                            </tbody>
                                        </table>
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
                                        <Button type="text" onClick={onInf}>
                                            <i className="el-icon-information color-blue"/>
                                        </Button>}

                                    {disabled ? null :
                                        <Button size="small" type="text" onClick={onRmv}>
                                            <i className="el-icon-close color-red-dark"/>
                                        </Button>}
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colSpan='6'>
                        <hr className='txt-hr my18'/>
                    </td>
                </tr>
            </React.Fragment>
        ;
        return editable;
    } //
}
export default TopicRow