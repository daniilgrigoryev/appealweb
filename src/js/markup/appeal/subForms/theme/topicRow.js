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

class TopicRow extends React.PureComponent {

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
        const {ind, field, value, onChange, onRemove, onInfo, onExpand, checkExpand, collapse,claim_id,dispatch,apn_list,sessionId,responseMode,adminMode,reloadRow,noChanges} = this.props;
        let {disabled} = this.props;
        disabled = disabled || responseMode || adminMode;

        const fldN = field + "post_n";
        const fldD = field + "post_date";
        const fldID_AP = field + "post_decree_id";
        const fldN_AP  = field + "post_decree_n";
        const fldD_AP  = field + "post_decree_date";
        const flds_post = [fldN,fldD,fldID_AP,fldN_AP,fldD_AP];
       
        const id             = value.get('id');
        const filesRows      = value.get('theme_files');
        const stat_in_work   = 'true'===value.get('stat_in_work'); 
        const stat_wait_post = 'true'===value.get('stat_wait_post');
        const stat_done      = 'true'===value.get('stat_done');
        
        const executor_id = value.get('executor_id');

        const post_n    = value.get('post_n');       // номер постановления введенный
        const post_date = value.get('post_date');    // дата постановления введенная
        const apn_post_decree_id     = value.get("post_decree_id");  // ИД постановления, связаный по АПР
        const apn_post_decree_n      = value.get('post_decree_n');   // номер постановления связанный по АПР
        const apn_post_decree_date   = value.get('post_decree_date');// дата постановления связанная по АПР
        
        const dateI = moment(post_date).format("MMM Do YY"); // date input parsed
        const dateD = moment(apn_post_decree_date).format("MMM Do YY");    // date input db
        
        const postClear = ()=>flds_post.forEach(x=>dispatch(change(`appeal`, x, null)));

        const linkedPost = !!apn_post_decree_id;      
        const linkDecree = async (passPost)=>{
            const orphan = true;
            const theme_id = id;
            const apn_post_n = passPost ? post_n: null;
            const apn_post_date = passPost ? post_date: null;

            const resp = await post("db/select",{alias : 'LINK_DECREE', theme_id,apn_post_n,apn_post_date,orphan}) // информация о постановлении передается - связывание
           
            const {data,error} = resp;
            if (error || data==''){
                console.error('linkDecree error:', error || 'No suitable record found');
                messageSet('Не удалось найти постановление в АДМ','error');
            } else {
                const text = passPost
                    ? 'Связано с постановлением в АДМ'
                    : 'Связь с постановлением в АДМ удалена';
                messageSet(text,'success');              
            }
            reloadRow();
        }

        const doLink = ()=>linkDecree(true);
        const doUnlink = ()=>linkDecree(false);

        let LinkerBTN = (<span>Невозможно связать с АПР</span>); //
        const apn_readonly = stat_in_work || apn_post_decree_id;    
        if (!noChanges){
            LinkerBTN = (<span>Для связи с АПР все изменения должны быть зафиксированы в БД</span>);
        } else {
            if (stat_in_work || stat_wait_post|| stat_done){
                LinkerBTN = apn_post_decree_id ? (<span>Связано с АПР</span>) : (<span>Не связано с АПР</span>); //
            } else {
                if (apn_post_decree_id){
                    LinkerBTN = (<Button onClick={doUnlink}>Отвязать от АПР</Button>); //
                } else if (post_n && post_date) {
                    LinkerBTN = (<Button onClick={doLink}>Связать с АПР</Button>); //
                }
            }
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

        const numberRuling = P.get(M.POST_N.name);

        if (!expanded) {
            return (<React.Fragment key={id} >
                    <tr>
                        <td>
                            <span className='ap-table-list-number mr12'>{ind + 1}</span>
                        </td>
                        <td>
                            <span className='inline-block mr12'>{this.props.getValue(P.get(M.CAT.name))}</span>
                        </td>
                        <td>
                            <span className='inline-block mr12 cutted-text wmax180' title={numberRuling}>{numberRuling}</span>
                        </td>
                        <td>
                            <span className='inline-block mr12'>{data2str(P.get(M.POST_DATE.name))}</span>
                        </td>
                        <td colSpan='2' className='pr12 align-r'>
                           <span className="ml12">
                               <Button type="text" onClick={onXpd}><i className="el-icon-edit color-green"/></Button>
                               {(disabled || responseMode) ? null : <Button type="text" onClick={onInf}><i className="el-icon-information color-blue"/></Button>}
                               {(disabled || responseMode) ? null : <Button size="small" type="text" onClick={onRmv}><i className="el-icon-close color-red-dark"/></Button>}
                           </span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan='6'>
                            <hr className='txt-hr my18'/>
                        </td>
                    </tr>
                </React.Fragment>);
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
                    {null && <Button type="text" size="small">
                        <span className='color-blue'>Зарезервировать слот в СУО</span>
                    </Button>}
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

        const dispatchForm = (fieldName,fieldVal)=>dispatch(change('appeal',fieldName,fieldVal));

        const statusChanger = async (next_status)=>{
            const orphan = true;
            const theme_id = id;

            if (!noChanges){
                messageSet('Для изменения статуса все изменения должны быть зафиксированы в БД','error');
                return;
            }

            try{
                const resp = await post("db/select",{alias : 'THEME_NEXT_STATUS', theme_id,next_status,orphan}); // информация о постановлении НЕ передается - разрыв
                const {data,error} = resp;
                if (error || data==''){
                    throw (error || 'Не удалось получить данные');
                } else {
                    messageSet('Статус темы изменен','success');              
                }
            } catch (exc){
                console.error('topic status change error:', exc);
                messageSet('Не удалось изменить статус темы','error');
            }

            reloadRow(); 
        }

        let STATUS_BTN = (<button>Нет исполнителя</button>);//
        if (_.size(executor_id)){
            STATUS_BTN = (<button onClick={()=>statusChanger('START')} >Назначен исполнитель. Запустить в работу</button>);//

            if (stat_in_work){/*
                STATUS_BTN = (
                    <React.Fragment>
                        <button onClick={()=>statusChanger('END')}>В работе. Исполнить.</button>
                        <button onClick={()=>statusChanger('PAUSE')} >Остановить производство</button>
                    </React.Fragment>);*/

                STATUS_BTN = (<button onClick={()=>statusChanger('END')}>В работе. Исполнить.</button>);///            
            } else if (stat_wait_post){
               // STATUS_BTN = (<button onClick={()=>statusChanger('REWIND')} >Ожидает отправки. Вернуть в работу</button>);/// 
               STATUS_BTN = (<button onClick={()=>statusChanger('COMMIT')} >Ожидает отправки</button>);/// 
            } else if (stat_done){
                STATUS_BTN = (<button>Исполнено</button>);//
            }
        }

        const editable =
            <React.Fragment key={id + 'e1'}>
                <tr>
                    <td colSpan='6'>
                        <div className='px12 py12 my6 ml-neg12 bg-white border round border--gray-light shadow-darken10'>
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <span className='ap-table-list-number mr12'>{ind + 1}</span>
                                    </td>
                                    <td>
                                        <span className='inline-block mr12 wmin60'>
                                            <Field disabled={disabled} component={FAutocomplete} name={field + M.CAT.name}
                                                   placeholder={M.CAT.label}
                                                   dataKey={M.CAT.key} value={P[M.CAT.name]}/>
                                        </span>
                                    </td>

                                    {manualPostLink
                                        ? (<td>
                                             <span className='inline-block mr12 w240'>
                                                <Field disabled={disabled || apn_readonly} component={FInput} name={field + M.POST_N.name}
                                                       placeholder={M.POST_N.label}
                                                       value={P[M.POST_N.name]}/>
                                             </span>
                                            </td>)
                                        : (<td>
                                            <span className='inline-block mr12 w240'>
                                                <Field disabled={disabled || apn_readonly} component={FAutocomplete} name={field + M.POST_N.name}
                                                       placeholder={M.POST_N.label} onSelect={postSelect}
                                                       datapromise={apnPromise} value={P[M.POST_N.name]}/>
                                             </span>
                                            </td>)}                                

                                    <td>
                                        <span className='inline-block mr12 w240'>
                                            <Field disabled={!manualPostLink || disabled || apn_readonly} component={FPicker} name={field + M.POST_DATE.name} 
                                            placeholder={M.POST_DATE.label} value={P[M.POST_DATE.name]} datepicker='+'/>
                                        </span>
                                    </td>
                                    <td>
                                        {(disabled || apn_readonly) ? null : (
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
                                          </Switch>)}
                                    
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
                                                <td><Field disabled={disabled && !adminMode} component={FAutocomplete} name={field + 'executor_id'} dataKey={M_STATUS.EXECUTOR.key} /></td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>Отдел исполнителя</td>
                                                <td><Field disabled={disabled && !adminMode} component={FAutocomplete} name={field + 'executor_org_id'} dataKey={M_STATUS.DEPART.key} /></td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>Статус по теме</td>
                                                <td>{STATUS_BTN}</td>
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
                                                    <td><AddressData2 key={getAdrKey(value,['owner_ts_adr_id','owner_ts_adr_kvart'])} dispatchForm={dispatchForm} source={value} rootField={field} fields={['owner_ts_adr_id','owner_ts_adr_kvart','owner_ts_adr_line']}  disabled={disabled}>
                                                            {value.get('owner_ts_adr_line') || ''}
                                                        </AddressData2>
                                                    </td>
                                                </tr>)
                                            )}
                                            {cif(M.APN_ADR.name,
                                                (<tr>
                                                    <td className='ap-input-caption'>{M.APN_ADR.label}</td>
                                                    <td><AddressData2 key={getAdrKey(value,['apn_adr_id','apn_adr_kvart'])} dispatchForm={dispatchForm} source={value} rootField={field} fields={['apn_adr_id','apn_adr_kvart','apn_adr_line']} disabled={disabled}>
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
                                                    <td className='ap-input-caption dog'>{M.DESISION_MAKER.label}</td>
                                                    <td><Field disabled={disabled} component={FAutocomplete} value={P[M.DESISION_MAKER.name]} name={field + M.DESISION_MAKER.name} dataKey={M.DESISION_MAKER.key} />
                                                    </td>
                                                    <td className="w120">
                                                        <h5 className='ap-h5 inline-block mx12'>И. О</h5>
                                                        <Field disabled={disabled} component={FCheckbox} value={P[M.UCH_PRIS.name]} name={field + M.UCH_PRIS.name}/>
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

                                            <tr>
                                                <td className='ap-input-caption'>Решение по АП</td>
                                                <td><Field disabled={disabled} component={FAutocomplete} name={field + 'apr_decis_id'} dataKey='APR_DECIS'/></td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>Статья-основание решения по АП</td>
                                                <td><Field disabled={disabled} component={FAutocomplete} name={field + 'apr_cause_id'} dataKey='APR_DECIS_CAUSE'/></td>
                                            </tr>
                                            <tr>
                                                <td className='ap-input-caption'>Причина прекращения по АП</td>
                                                <td><Field disabled={disabled} component={FAutocomplete} name={field + 'apr_stop_cause_id'} dataKey='APR_DECIS_STOP_CAUSE'/></td>
                                            </tr>
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