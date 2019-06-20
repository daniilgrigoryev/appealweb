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
    const event = document.createEvent('MouseEvents');
        event.initMouseEvent(
          'click', true, false, window, 0, 0, 0, 0, 0
          , false, false, false, false, 0, null
        );

    tempLink.href = downloadDocLink;
    tempLink.setAttribute('download', 'test.pdf');
    tempLink.dispatchEvent(event);

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
    }

    componentDidMount() {
        this.curHash = this.getHash();
        this.props.hashHolder(this.holdHash);
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
            const F = formData.toJS();
            const V = F ? F.values : {};

            const {error} = x.data;
            if (error) {
                let exc = error.split('Detail')[0];
                throw exc;
            }

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

    render() {
        const noop = () => {};
        const {disabled, formData, sessionId} = this.props;
        const noSave = !!(this.curHash && this.curHash == this.getHash())
        const stateBtnText = noSave ? 'Нет изменений' : 'Сохранить';
        const stateBtnClick = noSave ? noop : this.save;

        const {checking_date, registration_number,id} = _.get(formData ? formData.toJS():{}, 'values', {});  
        
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
                                <td className='ap-input-caption w120'>{M.CHK_DATE.label}</td>
                                <td>
                                    <span className={`px6 py1 mb6 round bg-blue-faint inline-block ${registration_number ? '' : 'opacity50'}`}>
                                        {!checking_date ? ('<Отсутствует>') : data2str(checking_date)}
                                    </span>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <table className='w-full'>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption w120'>{M.STATUS.label}</td>
                                <td>
                                    <Field disabled={disabled}
                                           className='w-full'
                                           component={FSelect}
                                           name={M.STATUS.name}
                                           dataKey={M.STATUS.key}/>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption w120'>{M.DEPART.label}</td>
                                <td>
                                    <Field disabled={disabled}
                                           className='w-full'
                                           component={FAutocomplete}
                                           name={M.DEPART.name}
                                           dataKey={M.DEPART.key}/>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption w120'>{M.EXECUTOR.label}</td>
                                <td>
                                    <Field disabled={disabled}
                                           className='w-full'
                                           component={FAutocomplete}
                                           name={M.EXECUTOR.name}
                                           dataKey={M.EXECUTOR.key}/>
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
                    {this.props.children}
                </div>

                <div className="ap-footer" className={`ap-footer ${noSave ? 'hidden' : ''}`}>
                    <Button disabled={noSave} type="success" size="small" plain={true} className='mr18'  onClick={stateBtnClick}>{stateBtnText}</Button>
                    <Button size="small" type='text' onClick={this.cancel} >Отменить</Button>
                </div>
            </div>
        )
    }
} //

const mapStateToProps = (state, props) => {
    const formData = state.getIn(['form', 'appeal']);
    const sessionId = state.getIn(['general','user','sessionID']);
    return {formData,sessionId};
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
