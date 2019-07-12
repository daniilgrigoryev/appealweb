import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import Immutable from 'immutable'
import {Button, Card, Layout} from 'element-react'

import mapping from '../mapping.js'

const M = mapping.ishHead;

const im = (obj) => Immutable.fromJS(obj)

const nDoc = [{property: '78-08', value: '78-08'}, 
             {property: '78-00', value: '78-00'}];

const getRow = (id, addr) => {
    return im({
        id: id || null,
        addr: addr || null
    })
}

const addressee = (props) => {
    const {fields, disabled} = props
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const ROWS = fields.map((x, i) => (
        <tr key={i}>
            <td className="align-r pr6 w24">
                <span className="ap-table-list-number">{i + 1}</span>
            </td>
            <td>
                <span>
                    <Field disabled={disabled} component={FInput}
                           name={x + M.ADDR.name}
                           value={x[M.ADDR.name]}
                           placeholder='Имя адресата'/>
                </span>
                {disabled ? null :
                    <Button size="small" className="absolute mt-neg2"  type="text" onClick={rmv(i)}>
                        <i className="el-icon-close color-red-dark ml6"/>
                    </Button>
                }
            </td>
        </tr>));//

    return (
        <React.Fragment>
            <hr className='txt-hr my6'/>
            <h4 className='ap-h4'>Список адресатов:</h4>

            {!fields.length ?
                <p className='mt-neg18 mb18 txt-em color-gray'>Нет добавленных адресатов</p>
                :
                <Layout.Row gutter="0">
                    <Layout.Col xs="24" md="12" lg="10">
                        <table className='mb18 w-full'>
                            <thead>
                            <tr>
                                <th className='ap-table__header'></th>
                                <th colSpan='2' className='ap-table__header wmin360'>Кому:</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ROWS}
                            </tbody>
                        </table>
                    </Layout.Col>
                </Layout.Row>
            }

            {disabled ? null :
                <Button size="small" icon="plus" onClick={add} type="success" plain={true}
                        className="flex-parent mb18"
                        title='Добавить адресата'>Добавить</Button>
            }
        </React.Fragment>
    );
};

class IshHead extends React.Component {//

    render() {
        const {disabled,notInsert} = this.props

        return (
            <React.Fragment>
                <Layout.Row gutter="0">
                    <Layout.Col xs="24" md="12" lg="10">
                        <table className='w-full'>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption wmin180'>
                                    {M.ZAJAV_NDOC.label}
                                </td>

                                {notInsert 
                                    ? <td colSpan='2'> <Field disabled={true} readonly={true} component={FInput} name='registration_number'/></td>
                                    : <React.Fragment>
                                        <td className='w120 pr6'>
                                            <Field disabled={disabled || notInsert} readonly={disabled || notInsert} component={FSelect} name={M.DOC_NUM.name} data={nDoc}/>
                                        </td>
                                        <td>
                                            <Field disabled={disabled || notInsert} readonly={disabled || notInsert} component={FInput} name={M.ORDER_NUM.name}/>
                                        </td>
                                    </React.Fragment>}
                            </tr>
                            <tr>
                                <td className='ap-input-caption wmin180'>
                                    {M.DOC_DAT.label}
                                </td>
                                <td className='w120 pr6'>
                                    <Field disabled={disabled} component={FPicker} name={M.DOC_DAT.name}
                                           datepicker='+'/>
                                </td>
                                <td></td>
                            </tr>

                            </tbody>
                        </table>
                    </Layout.Col>
                    <Layout.Col xs="24" md="12" lg="10">
                        <table className='w-full'>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption wmin180'>
                                    {M.SIGNER.label}
                                </td>
                                <td colSpan='2' className='w120'>
                                    <Field disabled={disabled} component={FInput} name={M.SIGNER.name}/>
                                </td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption wmin180'>
                                    {M.EXECUTOR.label}
                                </td>
                                <td colSpan='2' className='w120'>
                                    <Field disabled={disabled} component={FAutocomplete} name={M.EXECUTOR.name} dataKey={M.EXECUTOR.key}/>
                                </td>
                            </tr>

                            </tbody>
                        </table>
                    </Layout.Col>
                </Layout.Row>

                <FieldArray name='addressee' component={addressee} disabled={disabled}/>
            </React.Fragment>
        );
    }
}

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshHead)