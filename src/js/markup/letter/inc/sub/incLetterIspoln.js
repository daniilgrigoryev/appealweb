import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../../components/finput.js'
import {ESelect, FSelect} from '../../../components/select.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import * as _ from 'lodash'
import {Button} from 'element-react'

import mapping from '../mapping.js'

const M = mapping.incLetterIspoln;

const getRow = (id,desc, date) => {
    return {
        id: id || null,
        isp_proizv_number: desc || null,
        isp_proizv_date: date || null
    }
}

const postRows = React.memo(function postRows(props) {
    const {fields, disabled} = props;
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const inf = (ind) => () => fields.remove(ind);
    const ROWS = fields.map((x, i) => (
        <tr key={i}>
            <td>
                <span className="ap-table-list-number mr12">{i + 1}</span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FInput} name={x + M.DESC.name} value={x[M.DESC.name]}/>
                </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                   <Field disabled={disabled} component={FPicker} name={x + M.DATE.name} value={x[M.DATE.name]}
                          date='+'/>
                </span>
            </td>
            <td>
                {disabled ? null :
                    <Button size="small" type="text" onClick={rmv(i)}>
                        <i className="el-icon-close color-red-dark"/>
                    </Button>
                }
            </td>
        </tr>));

    return (
        <React.Fragment>
            {!fields.length ?
                <p className='mt-neg18 mb18 txt-em color-gray'>Нет документов исполнительного
                    производства</p>
                :
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table className='mb18'>
                                <thead>
                                <tr>
                                    <th className='ap-table__header'></th>
                                    <th className='ap-table__header'>{M.DESC.label}</th>
                                    <th className='ap-table__header'>{M.DATE.label}</th>
                                    <th className='ap-table__header'></th>
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
                        <table>
                            <tbody>
                            <tr>
                                <td colSpan='4'>
                                    {disabled ? null :
                                        <Button size="small" icon="plus" onClick={add}
                                                className="flex-parent mb18"
                                                title={M.ADD_N_PROIZ.label}>Добавить</Button>
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
});

const IncLetterIspoln =  React.memo(function IncLetterIspoln(props) {
    const {disabled} = props;
    return (
        <div>
            <hr className='txt-hr my18'/>
            <h4 className="ap-h4">{M.ISP_PROIZV.label}</h4>

            <FieldArray component={postRows} name='ispoln' disabled={disabled}/>
        </div>);
});

export default reduxForm({
    form: 'letter_incoming', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IncLetterIspoln)