import React from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {Button, Card, Layout, Tag, Popover} from 'element-react'

import mapping from './mapping.js'
import {FIshDocList} from "../subForms/ishDocList";

const headerTitle = 'Архивная информация';
const M = mapping.status;

const styleBtnWrap = {
    "position": 'fixed',
    "padding": '8px',
    "bottom": '60px',
    "right": '60px',
    "outline": "none"
};

const styleBtn = {
    width: '52px',
    height: '52px',
    'border-radius': '100%',
    display: "flex",
    'align-items': 'center',
    'justify-content': 'center',
    'font-size': '18px',
    'outline':'none'
};

class StatusData extends React.Component {

    constructor(props) {
        super(props);
        const show = false;
        this.state = {show};
    }

    render() {
        const {handleSubmit, pristine, nextPage, prevPage, submitting, header, disabled} = this.props;

        return (
            <div style={styleBtnWrap}>
                <Popover title={(
                    <h4 className='ap-h4'>Настройка состояния</h4>)}
                         width="420"
                         trigger="click"
                         content={(
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
                         )}>
                    <button style={styleBtn} className='bg-blue opacity25 opacity75-on-hover'
                            title='Показать состояние'>
                        <i className="el-icon-setting color-white"/>
                    </button>
                </Popover>
            </div>);
    } //
}

export default reduxForm({
    form: 'appeal', // <------ same form name                       disabled={pristine || submitting}
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(StatusData)