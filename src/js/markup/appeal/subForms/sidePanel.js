import React, {Component} from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {Button, Card, Layout, Tag} from 'element-react'
import {post} from '../../../services/ajax.js'
import Immutable from 'immutable'
import * as _ from 'lodash'
import {messageSet} from '../../../actions/common.js'

import mapping from './../appealContent/mapping.js'

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

class SidePanel extends Component {

    constructor(props) {
        super(props);
        this.curHash = 0;
        this.save = this.save.bind(this);
        this.getHash = this.getHash.bind(this);
    }

    componentDidMount() {
        this.curHash = this.getHash();
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
            dispatch(messageSet(x, 'error'));
            console.error(x);
            a.forceUpdate();
        });
    }

    render() {
        const noop = () => {};
        const {disabled, formData} = this.props;
        
        const noSave = !!(this.curHash && this.curHash == this.getHash())
        const stateBtnText = noSave ? 'Нет изменений' : 'Сохранить';
        const stateBtnClick = noSave ? noop : this.save;

        const {checking_date, registration_number} = _.get(formData ? formData.toJS():{}, 'values', {});

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
                                        {checking_date ? checking_date : '<Отсутствует>'}
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

                <div className={`ap-footer ${noSave ? 'hidden' : ''}`}>
                    <Button disabled={noSave} onClick={stateBtnClick}>{stateBtnText}</Button>
                </div>
            </div>
        )
    }
} //

const mapStateToProps = (state, props) => {
    const formData = state.getIn(['form', 'appeal']);
    return {formData};
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