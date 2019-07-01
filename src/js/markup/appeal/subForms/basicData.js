import React from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {Button, Card, Layout, Tag} from 'element-react'

import mapping from '../mapping.js'

const headerTitle = 'Основные сведения';
const M = mapping.basicData;

const BasicData = props => {
    const {nextPage, handleSubmit, prevPage, disabled} = props;
    const navi = !disabled && (nextPage||prevPage);
    return (
        <div scrollanchor='basic'>
            <Layout.Row gutter="20">
                <Layout.Col span="24">
                    <Card className="box-card sectionCard" header={
                        <div className='headline'>
                            <h3>{headerTitle}</h3>
                        </div>
                    }>
                    <form class="form"  onSubmit={handleSubmit}>
                        <div class="form-container">
                            <div class="wrap">
                                <div class="item">
                                    <small class="label">{M.EDO_NUM.label}</small>
                                    <div class="value">
                                        <Field disabled={disabled} component={FInput} name={M.EDO_NUM.name}/>
                                    </div>
                                </div>
                                <div class="item">
                                    <small class="label">{M.ECOO_NUM.label}</small>
                                    <div class="value">
                                        <Field disabled={disabled} component={FInput} name={M.ECOO_NUM.name}/>  
                                    </div>
                                </div>
                                <div class="item">
                                    <small class="label">{M.REQUEST_TYPE.label}</small>
                                    <div class="value">
                                        <Field disabled={disabled} component={FSelect} name={M.REQUEST_TYPE.name} dataKey={M.REQUEST_TYPE.key} placeholder='Выбор'/>
                                    </div>
                                </div>
                                <div class="item">
                                    <small class="label">{M.SHEETS_COUNT.label}</small>
                                    <div class="value">
                                        <Field disabled={disabled} component={FInput} name={M.SHEETS_COUNT.name}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    </Card>
                </Layout.Col>
            </Layout.Row>
        </div>
    )
} //

export default reduxForm({
    form: 'appeal', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
    enableReinitialize : true
    //validate
})(BasicData)
