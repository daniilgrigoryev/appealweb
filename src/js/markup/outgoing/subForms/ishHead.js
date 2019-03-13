import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import {Button} from 'element-react'

import mapping from '../mapping.js'

const M = mapping.ishHead;


const nDoc = ['78-08', '78-00']

const getRow = (addr) => {
    return {
        id: _.uniqueId('addr'),
        addr: addr || null
    }
}

const addressee = (props) => {
    const {fields, disabled} = props
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const ROWS = fields.map((x, i) => (
        <tr key={i}>
            <td>
                <span className="ap-table-list-number mr12">{i + 1}</span>
            </td>
            <td>
                <Field disabled={disabled} component={FInput}
                       name={x + M.ADDR.name}
                       value={x[M.ADDR.name]}
                       placeholder='Имя адресата'/></td>
            <td>
                {disabled ? null :
                    <Button type="text" onClick={rmv(i)}>
                        <i className="el-icon-delete color-red-dark"/>
                    </Button>
                }
            </td>
        </tr>));

    return (
        <React.Fragment>
            <hr className='txt-hr my18'/>
            <h4 className='ap-h4'>Список адресатов:</h4>

            {!fields.length ?
                <p className='mt-neg12 mb18 txt-em txt-s color-gray-light'>Нет добавленных адресатов</p>
                :
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table className='mb18'>
                                <thead>
                                <tr>
                                    <th className='ap-table-header'></th>
                                    <th colSpan='2' className='ap-table-header wmin360'>Кому:</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ROWS}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            }

            <table>
                <tbody>
                <tr>
                    <td className='ap-input-caption'></td>
                    <td>
                        <table className='wmin300'>
                            <tbody>
                            <tr>
                                <td colSpan='3'>
                                    {disabled ? null :
                                        <Button size="small" icon="plus" onClick={add}
                                                className="flex-parent mb18"
                                                title='Добавить адресата'>Добавить</Button>
                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </React.Fragment>
    );
};

class IshHead extends React.Component {

    render() {
        const {disabled} = this.props
        return (
            <div>
                <table className=''>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'>
                            {M.ZAJAV_NDOC.label}
                        </td>
                        <td>
                   <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FSelect} name={M.DOC_NUM.name} data={nDoc}/>
                   </span>
                        </td>
                        <td>
                  <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FInput} name={M.ORDER_NUM.name}/>
                  </span>
                        </td>
                        <td className='ap-input-caption wmin60'>
                            {M.DOC_DAT.label}
                        </td>
                        <td>
                  <span className='inline-block'>
                     <Field disabled={disabled} component={FPicker} name={M.DOC_DAT.name} datepicker='+'/>
                  </span>
                        </td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.SIGNER.label}</td>
                        <td>
                    <span className='mr12'>
                        <Field disabled={disabled} component={FInput} name={M.SIGNER.name}/>
                    </span>
                        </td>
                        <td className='ap-input-caption wmin60'>{M.EXECUTOR.label}</td>
                        <td colSpan='2'>
                    <span className='mr12'>
                        <Field disabled={disabled} component={FInput} name={M.EXECUTOR.name}/>
                    </span>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <FieldArray name='addressee' component={addressee} disabled={disabled}/>
            </div>
        )
    }
}

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshHead)