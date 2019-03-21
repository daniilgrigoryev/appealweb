import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../../components/finput.js'
import {EAutocomplete,FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../../components/checkbox.js'
import {ESwitch,FSwitch} from '../../components/switch.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import {Button, Card, Layout, Tag} from 'element-react'

import mapping from './mapping.js'
import {FIshDocList} from "../subForms/ishDocList";

const headerTitle = 'Архивная информация';
const M = mapping.status;

const styleBtnWrap = {
    padding: '8px',
    display: 'inline-block',
    width: '300px',
    textAlign: 'center',
    position: 'absolute',
    top: '88px',
    left: 'calc( 50vw - 120px )'   
}

const styleTable = Object.assign({
    background: 'aliceblue',
    border: '1px solid #ccc',
    paddingBottom: '0px',
},styleBtnWrap);

const styleBtn = {
    width: '240px'
}

class StatusData extends React.Component {

    constructor(props){
        super(props);
        const show = false;
        this.state = {show};
        this.toggleShow = this.toggleShow.bind(this);
    }

    toggleShow(show){
        this.setState({show});
    }

    render(){
        const { handleSubmit, pristine, nextPage, prevPage, submitting, header,disabled } = this.props;
        const {show} = this.state;

        if (!show){
            return (<div style={styleBtnWrap}><Button style={styleBtn} onClick={()=>this.toggleShow(true)}>Показать состояние</Button></div>);
        } //

        return (
            <div style={styleTable}>
                <table>
                    <tbody>
                         <tr>
                            <td colSpan='2' style={{textAlign: 'center'}}>
                                <Button style={styleBtn} onClick={()=>this.toggleShow(false)} >Скрыть состояние</Button>
                            </td>
                        </tr>
                        <tr>
                            <td>{M.STATUS.label}</td>
                            <td><Field disabled={disabled} 
                                    component={FSelect} 
                                    name={M.STATUS.name} 
                                    dataKey={M.STATUS.key}/></td>
                        </tr>
                        <tr>
                            <td>{M.DEPART.label}</td>
                            <td><Field disabled={disabled} 
                                    component={FAutocomplete} 
                                    name={M.DEPART.name} 
                                    dataKey={M.DEPART.key}/></td>
                        </tr>
                        <tr>
                            <td>{M.EXECUTOR.label}</td>
                            <td><Field disabled={disabled} 
                                    component={FAutocomplete} 
                                    name={M.EXECUTOR.name} 
                                    dataKey={M.EXECUTOR.key}/></td>
                        </tr>
                    </tbody>
                </table>       
            </div>);
    }
}  //

export default reduxForm({
  form: 'appeal', // <------ same form name                       disabled={pristine || submitting}
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(StatusData)