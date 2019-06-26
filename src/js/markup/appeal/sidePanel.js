import React, {Component} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Button, Card, Layout, Tag} from 'element-react'
import {Field, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../components/checkbox.js'
import {ESwitch, FSwitch} from '../components/switch.js'
import {ESelect, FSelect} from '../components/select.js'
import {EPicker, FPicker} from '../components/picker.js'
import {post} from '../../services/ajax.js'
import {baseUrl} from '../../services/api.js'
import Immutable from 'immutable'
import * as _ from 'lodash'
import {messageSet} from '../../actions/common.js'
import moment from 'moment'
import mapping from './mapping.js'
import PropTypes from 'prop-types'
import {reset} from 'redux-form';
import BasicData from './subForms/basicData.js'
import ClaimantData from './subForms/claimantData.js'
import AddressData from '../common/addressData.js' 
import OrganizationsData from './subForms/organizationsData.js'
import SummaryData from './subForms/summaryData.js'
import TopicsData from './subForms/theme/topicsData.js'
import IshDocsData from './subForms/ishdoc/ishDocsData.js'
import PlusDocs from './subForms/plusDocs.js'
import ArchiveData from './subForms/archiveData.js'
import DocsLink from './subForms/docsLink.js'
import StatusData from './subForms/statusData.js'
import {appealSetId} from '../../actions/common.js'
import {getRights} from  '../../services/rights.js'

const alias = 'CLAIM_PUSH_COMBO';
const headerTitle = 'Основные сведения';
const M = mapping.status;

const im = (obj) => Immutable.fromJS(obj)
const hashCode = (s) => (s || '').split('').reduce((hash, val) => (((hash << 5) - hash) + val.charCodeAt(0)) | 0, 0);

const scrollNavi = (attr) => {
    return () => {
        const el = document.querySelector('div[scrollanchor="' + attr + '"]');
        el && el.scrollIntoView();
    }
}

const testGetFile = (sessionId, claim_id,report_alias,report_fname)=>{
    const params = new URLSearchParams()
    params.append('session',sessionId)
    params.append('claim_id',claim_id)
    params.append('report_alias',report_alias)
    params.append('report_fname',report_fname)
    
    const downloadDocLink = baseUrl() + 'report/fill?'+params.toString()

    const tempLink = document.createElement('a');
    tempLink.href = downloadDocLink;
    tempLink.setAttribute('download', 'test.pdf');
    tempLink.click();

    setTimeout(()=>{
      tempLink && (tempLink.remove());
    },5000);
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

class SidePanel extends Component {

    constructor(props) {
        super(props);
        this.curHash = 0;
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
        this.getHash = this.getHash.bind(this);
        this.holdHash = this.holdHash.bind(this);
        this.duplicate = this.duplicate.bind(this);
        this.reloadRow = this.reloadRow.bind(this);  
    }

    async reloadRow() {
        const {dispatch, change, initialize,id} = this.props;
        const alias = 'CLAIM_GET';
        const orphan = true;
        const claim_id = id;
        const x = await post('db/select', {alias, claim_id,orphan});
        dispatch(initialize(im(x.data)));
        setTimeout(()=>(this.hashHold && this.hashHold()),500);
    }

    componentDidMount() {
        this.curHash = this.getHash();
    }

    holdHash(){
        this.curHash = this.getHash();
        this.forceUpdate();
    }

    getHash() {
        const {formData} = this.props;
        return !formData ? 0 : hashCode(JSON.stringify(_.omit(formData.toJS().values,['linked_docs'])));
    }

    save() {
        const a = this;
        const {formData, dispatch, change, initialize} = this.props;
        const data = JSON.stringify(Object.assign({}, formData.toJS().values));
        const jsonMode = true;

        post('db/select', {alias, data, jsonMode}).then(x => {
            const json = x.data.rows[0][0].value; // the first column value of single row expected
            try {
                const R = JSON.parse(json); // ret holder
                dispatch(initialize(im(R)));
                setTimeout(() => {
                    a.curHash = a.getHash();
                    a.forceUpdate();
                }, 1000);
            } catch (exc) {
                console.error(exc);
            }
        }).catch(x => {
            messageSet(x, 'error');
            console.error(x);
            a.forceUpdate();
        });
    }

    cancel() {
        const {formData, dispatch, initialize} = this.props;
        const inState = formData.get('initial');
        dispatch(initialize(inState));
    }

    duplicate() {
        const {dispatch, change, initialize, sessionId, formData} = this.props;
        const a = this;
        const jsonMode = true;
        const vals = formData.toJS().values;
        const preData = _.pick(vals, [
            "cdr_address_id", "cdr_strict_address", "city_id", "dom", "email", "fam", "inn", 
            "ish_number", "issue_date", "issued_to_emp_id", "issued_to_exec_org_id", "korpus", "kvart", "line_adr", "lpp", 
            "name", "npunkt", "office", "org_name", "phone", "pindex", "podpis", "pred_fam", 
            "pred_name", "pred_sex", "pred_surname", "rayon", "rayon_id", 
            "region", "request_type", "sex", "sheets_count", "street", "street_id", "surname", "zajav_lic"
        ]);
        
        const data = Object.assign({}, preData);
        dispatch(initialize(im(data)));
        setTimeout(()=>{
            const key = window.stateSave();
            const href = window.location.href.replace('/appeal_incoming',`/appeal_incoming&storageKey=${key}`);
            window.open(href,'_blank');
            setTimeout(()=>{
                    dispatch(initialize(im({})))
                    dispatch(initialize(im(vals)));       
                },500);
            },200);
    }

    render() {
        const noop = () => {};
        const {dispatch,change,initialize,disabled,formData,sessionId} = this.props;
        try{
          const h = window.location.hash.split('?');
          if (h[1]=='new'){
            window.location.hash = h[0];
            setTimeout(()=>dispatch(initialize(im({}))),100);
            return (<span>Новое обращение</span>); //
          }
        } catch (exc) {
          //debugger;
        }//

        const noChanges = !!(this.curHash && this.curHash == this.getHash()); 
        
        const stateBtnText  = noChanges ? 'Нет изменений' : 'Сохранить';
        const stateBtnClick = noChanges ? noop : this.save;

        let checking_date = null;
        let registration_number = null; 
        let id = null;
        let processing_stage_id = null;
        const values = !formData ? null : formData.get('values');
        if (values){
            checking_date = values.get('checking_date');
            registration_number = values.get('registration_number');
            id = values.get('id');
            processing_stage_id = values.get('processing_stage_id');
        }

        const showDupe = (+processing_stage_id) >= 2; //Зарегистрировано
        const {Provider} = React.createContext({ color: 'white' });

        let addrH = (<form>
            <hr className="txt-hr my6"/>
            <h4 className='ap-h4'>Адрес</h4>
            </form>);

        const cBack = (arg_arr) => _.each(arg_arr||[],x=>dispatch(change(x.name, x.value || '')));
    
        let fullAddr = {};
        let fl = false;
        let line_adr = '';
        let claim_id;
        let files = [];

        if (formData) {
          fl       = formData.get('zajav_lic')|| false;
          line_adr = formData.get('line_adr') || '';
          files = formData.get('files') || [];
          fullAddr = _.pick(formData.toJS(), [
            'cdr_address_id', 
            'dom', 
            'korpus', 
            'kvart',
            'line_adr', 
            'city_id', 
            'pindex', 
            'rayon_id', 
            'region', 
            'str', 
            'street_id']);
          claim_id = formData.get('id') || ''; 
          //debugger;
          //testGetFile(this.props.sid, claim_id);
        }

        const right = 'general_super';

        let CONTENT = (<div style={{fontFamily:'monospace',width: '800px'}}>
───────────────────────────────────────────────────────────────
───────────────████████────────────────────────────────────────
──────────────███▄███████──────────────────────────────────────
──────────────███████████──────────────────────────────────────
──────────────███████████──────────────────────────────────────
──────────────██████───────────────────────────────────────────
──────────────█████████────────────────────────────────────────
────█───────███████────────────────────────────────────────────
────██────████████████───────────── Недостаточно прав ─────────
────███──██████████──█────────── для просмотра обращения───────
────███████████████────────────────────────────────────────────
────███████████████────────────────────────────────────────────
─────█████████████─────────────────────────────────────────────
──────███████████──────────────────────────────────────────────
────────████████───────────────────────────────────────────────
─────────███──██───────────────────────────────────────────────
─────────██────█───────────────────────────────────────────────
─────────█─────█───────────────────────────────────────────────
─────────██────██──────────────────────────────────────────────
───────────────────────────────────────────────────────────────
        </div>); //

        const reloadRow = this.reloadRow;
        const P = {noChanges,reloadRow};

         const [head,tail] = right.split('_');
    if (head=='office'){
      if (tail=='clerk'){
         CONTENT = (<React.Fragment>
            <BasicData {...P} disabled={true}/>
            <ClaimantData {...P} disabled={true}/>
             {addrH}
            <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr} disabled={true} />
            <OrganizationsData {...P} disabled={true}/>
            <SummaryData {...P} disabled={true}/>
          </React.Fragment>); //
      } else if (tail=='response') {
        CONTENT = ( <TopicsData reloadRow={this.reloadRow}   responseMode={true} />); //
      } else if (tail=='chief') {
        CONTENT = (<React.Fragment>
            <BasicData />
            <ClaimantData />
            {addrH}
            <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr}  />
            <OrganizationsData />
            <SummaryData />
          </React.Fragment>); //
      }
    } else if (head=='department'){
      if (tail=='admin'){
         CONTENT = (<React.Fragment>
              <BasicData disabled={true}/>
              <ClaimantData disabled={true}/>
              {addrH}
              <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr} disabled={true} />
              <OrganizationsData disabled={true}/>
              <SummaryData disabled={true}/>
              <TopicsData reloadRow={this.reloadRow}   adminMode={true} />
            </React.Fragment>); //
      } else if (tail=='clerk'){
         CONTENT = (<React.Fragment>
              <TopicsData reloadRow={this.reloadRow}   />
              <IshDocsData reloadRow={this.reloadRow} />
              <DocsLink reloadRow={this.reloadRow} />
             </React.Fragment>); //
      } else if (tail=='verifier'){
         CONTENT = (<React.Fragment>
              <TopicsData reloadRow={this.reloadRow}   disabled={true} />
              <IshDocsData reloadRow={this.reloadRow} disabled={true} />
              <DocsLink reloadRow={this.reloadRow} disabled={true} />
             </React.Fragment>); //
      } else if (tail=='chief'){
         CONTENT = (<React.Fragment>
              <TopicsData reloadRow={this.reloadRow}   />
              <IshDocsData reloadRow={this.reloadRow} />
              <DocsLink reloadRow={this.reloadRow} />
             </React.Fragment>); //
      }
    } else if (head=='archive'){
      if (tail=='clerk'){
        CONTENT = <ArchiveData/>
      } else if (tail=='chief'){
        CONTENT = (<React.Fragment>
                      <BasicData disabled={true}/>
                      <ClaimantData disabled={true}/>
                      <TopicsData reloadRow={this.reloadRow}   disabled={true} />
                      <IshDocsData reloadRow={this.reloadRow} disabled={true} />
                      <DocsLink reloadRow={this.reloadRow} disabled={true} />
                      <ArchiveData/>
                   </React.Fragment>); //
      }
    } else if (head=='general'){
      if (tail=='observer'){
          CONTENT = (<React.Fragment>
            <BasicData disabled={true}/>
            <ClaimantData disabled={true}/>
            {addrH}
            <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr} disabled={true} />
            <OrganizationsData disabled={true}/>
            <SummaryData disabled={true}/>
            <TopicsData reloadRow={this.reloadRow}   disabled={true}/>
            <IshDocsData reloadRow={this.reloadRow} disabled={true} />
            <DocsLink reloadRow={this.reloadRow} disabled={true}/>
            <PlusDocs disabled={true} />
            <ArchiveData disabled={true}/>
          </React.Fragment>); //
      } else if (tail=='super') {
        CONTENT = (<React.Fragment>
            <BasicData {...P} />
            <ClaimantData {...P} />
            {addrH}
            <AddressData key={JSON.stringify(fullAddr)} cBack={cBack} fullAddr={fullAddr} />
            <OrganizationsData {...P} />
            <SummaryData {...P} />
            <TopicsData {...P}  />
            <IshDocsData {...P} />
            <DocsLink {...P}/>
            <PlusDocs {...P} />
            <ArchiveData {...P} />
          </React.Fragment>); //
      }
    }

    return (
            <div className='ap-side-panel-wrap'>
                <div className='ap-side-panel-left'>
                    <div className="el-card__header">
                        <h3 className="ap-h3">Статус и исполнитель</h3>
                    </div>

                    <div className='mr12'>
                        <table className='ap-side-panel-left__statuses w-full'>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption w120'>{M.REG_NUM.label}</td>
                                <td>
                                    <span className={`px6 py1 mb6 round bg-blue-faint inline-block ${registration_number ? '' : 'opacity50'}`}>
                                        {registration_number ? registration_number : '<Отсутствует>'}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption w120'>{M.REG_DATE.label}</td>
                                <td>
                                    <Field disabled={disabled} className='w-full' component={FPicker} name={M.REG_DATE.name} date='+'/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table className='w-full'>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption w120'>{M.STATUS.label}</td>
                                <td>
                                    <Field disabled={disabled} className='w-full' component={FSelect} name={M.STATUS.name} dataKey={M.STATUS.key}/>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption w120'>{M.DEPART.label}</td>
                                <td>
                                    <Field disabled={disabled} className='w-full' component={FAutocomplete} name={M.DEPART.name} dataKey={M.DEPART.key}/>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption w120'>{M.EXECUTOR.label}</td>
                                <td>
                                    <Field disabled={disabled} className='w-full' component={FAutocomplete} name={M.EXECUTOR.name} dataKey={M.EXECUTOR.key}/>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption w120'>{M.CHK_DATE.label}</td>
                                <td>
                                    <Field disabled={disabled} className='w-full' component={FPicker} name={M.CHK_DATE.name} date='+'/>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption w120'>{M.CLS_DATE.label}</td>
                                <td>
                                    <Field disabled={disabled} className='w-full' component={FPicker} name={M.CLS_DATE.name} date='+'/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                     <div className="el-card__header el-card__header--top-border" onClick={()=>testGetFile(sessionId, id,'IN_APPEAL_OLD',registration_number)}>
                        <h3 className="ap-h3">Печать малый</h3>
                    </div>
                    <div className="el-card__header el-card__header--top-border" onClick={()=>testGetFile(sessionId, id,'IN_APPEAL_FULL',registration_number)}>
                        <h3 className="ap-h3">Печать большой</h3>
                    </div>
                    {showDupe && <div className="el-card__header el-card__header--top-border" onClick={()=>this.duplicate()}>
                        <h3 className="ap-h3">Дублировать</h3>
                    </div>}

                    <div className="el-card__header el-card__header--top-border">
                        <h3 className="ap-h3">Список подразделов</h3>
                    </div>

                    <ul className='ap-side-panel-left__nav mt12'>
                        <li onClick={scrollNavi('basic')}>Основные сведения</li>
                        <li onClick={scrollNavi('claimant')}>Сведения о заявителе</li>
                        <li onClick={scrollNavi('organizations')}>Организации</li>
                        <li onClick={scrollNavi('summary')}>Краткое содержание</li>
                        <li onClick={scrollNavi('topics')}>Темы обращения</li>
                        <li onClick={scrollNavi('ishDoc')}>Исходящие документы</li>
                        <li onClick={scrollNavi('links')}>Связанные обращения/письма</li>
                        <li onClick={scrollNavi('archive')}>Архивная информация</li>
                    </ul>
                </div>
                <div className='ap-side-panel-content'>
                    <Card className="ap-sticky-card box-card" bodyStyle={{ padding: 0 }} header={
                        <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                            <h1 className='ap-h1 flex-parent flex-parent--center-cross'>
                                Входящее обращение
                            </h1>
                        </div>
                    }>
                    {CONTENT}
                    </Card>
                </div>

                <div className="ap-footer" className={`ap-footer ${noChanges ? 'hidden' : ''}`}>
                    <Button disabled={noChanges} type="success" size="small" plain={true} className='mr18'  onClick={stateBtnClick}>{stateBtnText}</Button>
                    <Button size="small" type='text' onClick={this.cancel} >Отменить</Button>
                </div>
            </div>
        )
    }
} //

const mapStateToProps = (state, props) => {
    const formData = state.getIn(['form', 'appeal']);
    const sessionId = state.getIn(['general','user','sessionID']);
    const id = state.getIn(['form','appeal','values','id']);
    const sid = state.getIn(['general','user','sessionID']);
    return {formData,sessionId,id,sid};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
        enableReinitialize: true
        //validate
    })
)(SidePanel)
