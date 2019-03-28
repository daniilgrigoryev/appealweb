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

import './sidePanel.scss'
import mapping from './../appealContent/mapping.js'

const alias = 'CLAIM_PUSH_COMBO';
const headerTitle = 'Основные сведения';
const M = mapping.status;

const hashCode = (s) =>(s||'').split('').reduce((hash, val) =>(((hash << 5) - hash) + val.charCodeAt(0))|0, 0);


class SidePanel extends Component {
    
    constructor(props) {
        super(props);
        this.curHash = 0;
        this.save = this.save.bind(this);
        this.getHash = this.getHash.bind(this);
    }

    componentDidMount(){
        this.curHash = this.getHash();
    }

    getHash(){
        const {formData} = this.props;
        return !formData ? 0 : hashCode(JSON.stringify(formData.values));
    }
    
    save(){        
        const {formData,dispatch,change} = this.props;
        const data = JSON.stringify(Object.assign({},formData.values));
        const jsonMode = true;
        
        post('db/push',{alias,data,jsonMode}).then(x=>{
            const F = formData;
            const V = F ? F.values : {};

            const {error} = x.data;
            if (error){
              let exc = error.split('Detail')[0];
              throw exc;
            }

            const json = x.data.rows[0][0].value; // the first column value of single row expected
            // debugger;
            try{
                debugger;
              const R = JSON.parse(json); // ret holder
              dispatch(initialize(im(R)));
            } catch (exc){
              console.error(exc);
            } 
            
        }).catch(x=>{
            dispatch(messageSet(x,'error'));
            console.error(x);
            a.forceUpdate();
        });     
    }

    render(){
        const {disabled} = this.props;
        const noSave = this.curHash && this.curHash == this.getHash()
        const stateBtnText = noSave? 'Нет изменений' : 'Сохранить';
        const stateBtnClick = noSave ? ()=>{} : this.save;

        return (
            <div className='sidePanelWrap'>
                <div className='sidePanelLeft'>
                    <div>
                        <Button onClick={stateBtnClick}>{stateBtnText}</Button>
                    </div>

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

                    <ul>
                        <li>Основные сведения</li>
                        <li>Сведения о заявителе</li>
                        <li>Организации</li>
                        <li>Краткое содержание</li>
                        <li>Темы обращения</li>
                        <li>Исходящие документы</li>
                        <li>Архивная информация</li>
                    </ul>

                </div>
                <div className='sidePanelContent'>
                    {this.props.children}
                </div>
            </div>
        )    
    }
} //

const mapStateToProps = (state,props)=>{
    let formData = state.getIn(['form','appeal']);
    formData && (formData = formData.toJS());
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