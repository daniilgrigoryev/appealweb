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

class TopicRow extends React.PureComponent {

    constructor(props){
        super(props);
        const { value , apn_list } = this.props;
        const post_n = value ? value.get('post_n') : null;
        const post_date = value ? value.get('post_date') : null;
        const integWithPost = apn_list ? apn_list.find((item) => {
            if (item.get('date')) return item.get('date') === post_date && item.get('apn') === post_n
        }) : false;

        this.state = {
            manualPostLink: !(post_n && post_date && integWithPost),
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
                    LinkerBTN = (<Button  size="small" onClick={doUnlink}>Отвязать от АПР</Button>); //
                } else if (post_n && post_date) {
                    LinkerBTN = (<Button  size="small" onClick={doLink}>Связать с АПР</Button>); //
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
                    <div className="wrap wrap--infoview">
                        <div className="left-aside">
                            <div className="list-num mr12">{ind + 1}</div>
                        </div>
                        <div className="right-aside">
                            {(disabled || responseMode) ? null : <Button type="text" onClick={onRmv}>
                                <i className="ico round minus"/>
                            </Button>}
                            {(disabled || responseMode) ? null : <Button type="text" onClick={onInf}>
                                <i className="ico round info"/>
                            </Button>}
                            <Button type="text" onClick={onXpd}>
                                <i className="ico round edit"/>
                            </Button>
                        </div>
                        <div className="item">
                            <small className="label">{M.CAT.label}</small>
                            <div className="value">
                                {this.props.getValue(P.get(M.CAT.name)) 
                                    ? <b>{this.props.getValue(P.get(M.CAT.name))}</b> 
                                    : <span className="txt-middle color-gray-light">[не заполнено]</span>
                                }
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">{M.POST_N.label}</small>
                            <div className="value" title={numberRuling}>
                                {numberRuling ? numberRuling : <span className="txt-middle color-gray-light">[не заполнено]</span>}
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">{M.POST_DATE.label}</small>
                            <div className="value">
                                {data2str(P.get(M.POST_DATE.name)) ? data2str(P.get(M.POST_DATE.name)) : <span className="txt-middle color-gray-light">[не заполнено]</span>}
                            </div>
                        </div>
                    </div>
                </React.Fragment>);
        } //

        const PRIS_UCH = (!P.get(M.UCH_PRIS.name)) ? null : (<React.Fragment>
            <div className="item item--left">
                <small className="label">{M.RASSMOTR_DATE.label}</small>
                <div className="value w130">
                    <Field disabled={disabled} component={FPicker} name={field + M.RASSMOTR_DATE.name} value={P[M.RASSMOTR_DATE.name]} datetimepicker='+'/>
                </div>
            </div>
            <div className="item item--right">
                <div className="value">
                    {null && <Button type="text" size="small">
                        <span className='color-blue'>Зарезервировать слот в СУО</span>
                    </Button>}
                </div>
            </div>
        </React.Fragment>);
    //
        const postSelect = (args)=>{ // подсос даты
            const AL = apn_list;
            const newDateStr = AL ? _.chain(AL.toJS()||[]).filter(x=>+x.apn==+args.key).first().get('date').value() : false;
            const newVal = newDateStr ? new Date(Date.parse(newDateStr)) : null;
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

        let STATUS_BTN = (<button type='button' >Нет исполнителя</button>);//
        if (_.size(executor_id)){
            STATUS_BTN = (<button type='button'  onClick={()=>statusChanger('START')} >Назначен исполнитель. Запустить в работу</button>);//

            if (stat_in_work){/*
                STATUS_BTN = (
                    <React.Fragment>
                        <button type='button'  onClick={()=>statusChanger('END')}>В работе. Исполнить.</button>
                        <button type='button'  onClick={()=>statusChanger('PAUSE')} >Остановить производство</button>
                    </React.Fragment>);*/

                STATUS_BTN = (<button type='button'  onClick={()=>statusChanger('END')}>В работе. Исполнить.</button>);///            
            } else if (stat_wait_post){
               // STATUS_BTN = (<button type='button'  onClick={()=>statusChanger('REWIND')} >Ожидает отправки. Вернуть в работу</button>);/// 
               STATUS_BTN = (<button type='button'  onClick={()=>statusChanger('COMMIT')} >Ожидает отправки</button>);/// 
            } else if (stat_done){
                STATUS_BTN = (<button type='button' >Исполнено</button>);//
            }
        }

        const editable = (
        <div className="shadow-darken10" style={{'border':'1px solid #CCC'}} key={id + 'e1'} >
            
            <Card className="box-card sectionCard" scrollAnchor='+' header={
                <div className='headline'>
                    <h3>Краткая информация по теме</h3>
                </div>
            }>
                <div className="form-container">
                    <div className="wrap">
                        <div className="item item--full">
                            <small className="label">{M.CAT.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FAutocomplete} name={field + M.CAT.name}
                                                    placeholder={M.CAT.label}
                                                    dataKey={M.CAT.key} value={P[M.CAT.name]}/>
                            </div>
                        </div>

                        {manualPostLink
                        ? (<div className="item">
                            <small className="label">{M.POST_N.label}</small>
                            <div className="value">
                                <Field disabled={disabled || apn_readonly} component={FInput} name={field + M.POST_N.name}
                                            placeholder={M.POST_N.label}
                                            value={P[M.POST_N.name]}/>
                            </div>
                        </div>)
                        : (<div className="item">
                            <small className="label">{M.POST_N.label}</small>
                            <div className="value">
                                <Field disabled={disabled || apn_readonly} component={FAutocomplete} name={field + M.POST_N.name}
                                        placeholder={M.POST_N.label} onSelect={postSelect}
                                        datapromise={apnPromise} value={P[M.POST_N.name]}/>
                            </div>
                        </div>)}

                        <div className="item">
                            <small className="label">{M.POST_DATE.label}</small>
                            <div className="value w130">
                                <Field disabled={!manualPostLink || disabled || apn_readonly} component={FPicker} name={field + M.POST_DATE.name} 
                                                                            placeholder={M.POST_DATE.label} value={P[M.POST_DATE.name]} datepicker='+'/>
                            </div>
                        </div>
                        
                        <div className="item">
                            <small className="label">Ручной ввод</small>
                            <div className="value">
                                {(disabled || apn_readonly) ? null : (
                                    <Switch
                                    value={manualPostLink}
                                    onValue={true}
                                    offValue={false}
                                    onText='РУЧН'
                                    offText='АВТ'
                                    onChange={(value)=>{
                                        if (!value) {
                                            postSelect({visibleval: null, key: ''+post_n, name: fldN});
                                        }
                                        this.setManualPostLink(value);
                                        //postClear(); 
                                    }}>
                                    </Switch>)}
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">Связь с АПР</small>
                            <div className="value">
                                {LinkerBTN}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
            
            <Card className="box-card sectionCard" theme_id={id} header={
                <div className='headline'>
                    <h3>Детальная информация по теме</h3>
                </div>
            }>
                <div className="form-container">
                    <div className="wrap" key={id + 'e2'}>
                        <div className="item">
                            <small className="label">Отдел исполнителя</small>
                            <div className="value">
                            <Field disabled={disabled && !adminMode} component={FAutocomplete} onChange={()=>{
                                                   // dispatch(change(`appeal`, field + 'executor_id', null));
                                                }} name={field + 'executor_org_id'} dataKey={M_STATUS.DEPART.key} dbVisibleVal={P.get('executor_org_id_label')} />
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">Исполнитель</small>
                            <div className="value">
                                <Field disabled={disabled && !adminMode} component={FAutocomplete} name={field + 'executor_id'} dataKey={M_STATUS.EXECUTOR.key} dbVisibleVal={P.get('executor_id_label')} />               
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">Статус по теме</small>
                            <div className="value">
                                {STATUS_BTN}
                            </div>
                        </div>
                        <div className="item">
                            <small className="label">Дата контроля</small>
                            <div className="value w130">
                                <Field disabled={disabled} component={FPicker} name={field + 'control_date'} datepicker='+' />
                            </div>
                        </div>
                        <div className="item item--full">
                            <small className="label">{M.REL_DOCS.label}</small>
                            <div className="value">
                                <TopicDocs rows={filesRows} sessionId={sessionId} />
                            </div>
                        </div>
                        <div className="item item--full">
                            <small className="label">{M.UCH_PRIS.label}</small>
                            <div className="value">
                                <Field disabled={disabled} component={FCheckbox} value={P[M.UCH_PRIS.name]} name={field + M.UCH_PRIS.name}/>
                            </div>
                        </div>
                        {PRIS_UCH}

                        {cif(M.CODEX_ARTICLE.name,
                            (<div className="item">
                                <small className="label">{M.CODEX_ARTICLE.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FInput} value={P[M.CODEX_ARTICLE.name]} name={field + M.CODEX_ARTICLE.name}/>
                                </div>
                            </div>)
                        )}
                        {cif(M.OWNER_TS.name,
                            (<div className="item">
                                <small className="label">{M.OWNER_TS.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FInput} value={P[M.OWNER_TS.name]} name={field + M.OWNER_TS.name}/>
                                </div>
                            </div>)
                        )}
                        {cif(M.OWNER_TS_ADR.name,
                            (<div className="item item--full">
                                <small className="label">{M.OWNER_TS_ADR.label}</small>
                                <div className="value">
                                    <AddressData2 key={getAdrKey(value,['owner_ts_adr_id','owner_ts_adr_kvart'])} dispatchForm={dispatchForm} source={value} rootField={field} fields={['owner_ts_adr_id','owner_ts_adr_kvart','owner_ts_adr_line']}  disabled={disabled}>
                                        {value.get('owner_ts_adr_line') || ''}
                                    </AddressData2>
                                </div>
                            </div>)
                        )}
                        {cif(M.APN_ADR.name,
                            (<div className="item  item--full">
                                <small className="label">{M.APN_ADR.label}</small>
                                <div className="value">
                                    <AddressData2 key={getAdrKey(value,['apn_adr_id','apn_adr_kvart'])} dispatchForm={dispatchForm} source={value} rootField={field} fields={['apn_adr_id','apn_adr_kvart','apn_adr_line']} disabled={disabled}>
                                        {value.get('apn_adr_line') || ''}
                                    </AddressData2>
                                </div>
                            </div>)
                        )}
                        {cif(M.APN_DATA.name,
                            (<div className="item item--full">
                                <small className="label">{M.APN_DATA.label}</small>
                                <div className="value w130">
                                    <Field disabled={disabled} component={FPicker} value={P[M.APN_DATA.name]} name={field + M.APN_DATA.name} datepicker='+'/>
                                </div>
                            </div>)
                        )}

                        {cif(M.DESCRIPTION.name,
                            (<div className="item item--full">
                                <small className="label">{M.DESCRIPTION.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FInput} value={P[M.DESCRIPTION.name]} name={field + M.DESCRIPTION.name} type="textarea"/>
                                </div>
                            </div>)
                        )}

                        {cif(M.VIOLATOR_REGNO.name,
                            (<div className="item">
                                <small className="label">{M.VIOLATOR_REGNO.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FInput} value={P[M.VIOLATOR_REGNO.name]} name={field + M.VIOLATOR_REGNO.name}/>
                                </div>
                            </div>)
                        )}
                        {cif(M.APPEAL_CAUSE.name,
                            (<div className="item">
                                <small className="label">{M.APPEAL_CAUSE.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FAutocomplete} value={P[M.APPEAL_CAUSE.name]} name={field + M.APPEAL_CAUSE.name} dataKey={M.APPEAL_CAUSE.key}/>
                                </div>
                            </div>)
                        )}

                        {cif(M.DESISION_MAKER.name,
                            (<div className="item-fully">
                            <div className="item" style={{'grid-column':'1 / span 3'}}>
                                <small className="label">{M.DESISION_MAKER.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FAutocomplete} value={P[M.DESISION_MAKER.name]} name={field + M.DESISION_MAKER.name} dataKey={M.DESISION_MAKER.key}  dbVisibleVal={P.get('decision_maker_label')} />
                                </div>
                            </div>
                            <div className="item item--flow" style={{'grid-column':'auto / span 1'}}>
                                <small className="label">И. О</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FCheckbox} value={P[M.UCH_PRIS.name]} name={field + M.UCH_PRIS.name}/>
                                </div>
                            </div>
                            </div>)
                        )}
                        {cif(M.DECISION_THEME.name,
                            (<div className="item">
                                <small className="label">{M.DECISION_THEME.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FAutocomplete} value={P[M.DECISION_THEME.name]} name={field + M.DECISION_THEME.name} dataKey={M.DECISION_THEME.key}/>
                                </div>
                            </div>)
                        )}
                        {cif(M.DECISION_DATE.name,
                            (<div className="item">
                                <small className="label">{M.DECISION_DATE.label}</small>
                                <div className="value w130">
                                    <Field disabled={disabled} component={FPicker} value={P[M.DECISION_DATE.name]} name={field + M.DECISION_DATE.name} datepicker='+'/>
                                </div>
                            </div>)
                        )}
                        {cif(M.DECISION_BASIS.name,
                            (<div className="item">
                                <small className="label">{M.DECISION_BASIS.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FAutocomplete} value={P[M.DECISION_BASIS.name]} name={field + M.DECISION_BASIS.name} dataKey={M.DECISION_BASIS.key}/>
                                </div>
                            </div>)
                        )}
                        {cif(M.POST_APPEAL_CAUSE.name,
                            (false &&  <div className="item">
                                <small className="label">{M.POST_APPEAL_CAUSE.label}</small>
                                <div className="value">
                                    <Field disabled={disabled} component={FAutocomplete} value={P[M.POST_APPEAL_CAUSE.name]} name={field + M.POST_APPEAL_CAUSE.name} dataKey={M.POST_APPEAL_CAUSE.key}/>
                                </div>
                            </div>)
                        )}
                        <div className="item">
                            <small className="label">Решение по АП</small>
                            <div className="value">
                                <Field disabled={disabled} component={FAutocomplete} name={field + 'apr_decis_id'} dataKey='APR_DECIS'/>
                            </div>
                        </div>
                        <div className="item item--full">
                            <small className="label">Статья-основание решения по АП</small>
                            <div className="value">
                                <Field disabled={disabled} component={FAutocomplete} name={field + 'apr_cause_id'} dataKey='APR_DECIS_CAUSE'/>
                            </div>
                        </div>
                        <div className="item item--full">
                            <small className="label">Причина прекращения по АП</small>
                            <div className="value">
                                <Field disabled={disabled} component={FAutocomplete} name={field + 'apr_stop_cause_id'} dataKey='APR_DECIS_STOP_CAUSE'/>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>




            <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross bg-white px18 py12'>
                <div>
                    {/* {disabled ? null :
                        <Button type="text" onClick={onInf}>
                            <i className="el-icon-information color-blue"/>
                        </Button>} */}

                    {disabled ? null :
                        <Button size="small" type="text" onClick={onRmv}>
                            <i className="el-icon-delete color-red-dark" style={{'fontSize': '18px'}}/>
                        </Button>}
                </div>
                <Button type="primary" size="small" onClick={collapse}>
                    <span>Свернуть</span>
                </Button>
            </div>
        </div>
        );
        return editable;
    } //
}
export default TopicRow