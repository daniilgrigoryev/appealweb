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
                    <Card className="box-card" header={
                        <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                            <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                {headerTitle}
                            </h3>
                        </div>
                    }>
                        <Layout.Row gutter="0">
                            <Layout.Col xs="24" md="12" lg="12">
                                <form onSubmit={handleSubmit}>
                                    <table className='w-full'>
                                        <tbody>
                                        <tr>
                                            <td className='ap-input-caption'>{M.EDO_NUM.label}</td>
                                            <td><Field disabled={disabled} component={FInput} name={M.EDO_NUM.name}/></td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption'>{M.ECOO_NUM.label}</td>
                                            <td><Field disabled={disabled} component={FInput} name={M.ECOO_NUM.name}/></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </Layout.Col>
                            <Layout.Col xs="24" md="12" lg="12">
                                <form className='ml0' onSubmit={handleSubmit}>
                                    <table className='w-full'>
                                        <tbody>
                                        <tr>
                                            <td className='ap-input-caption'>{M.REQUEST_TYPE.label}</td>
                                            <td><Field disabled={disabled} component={FSelect} name={M.REQUEST_TYPE.name}
                                                       dataKey={M.REQUEST_TYPE.key} placeholder='Выбор'/></td>
                                        </tr>
                                         <tr>
                                            <td className='ap-input-caption'>{M.SHEETS_COUNT.label}</td>
                                            <td><Field disabled={disabled} component={FInput} name={M.SHEETS_COUNT.name}/></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </form>
                            </Layout.Col>
                        </Layout.Row>
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
