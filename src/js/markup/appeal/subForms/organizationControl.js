import React from 'react'
import * as _ from 'lodash'
import {Button} from 'element-react'
import {Field, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {FSelect} from '../../components/select.js'
import {FAutocomplete} from '../../components/fautocomplete.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as V from '../../../validators'
import mapping from '../mapping.js'

const M = mapping.organizationControl;

const getRow = (id, name, num, date, control_date) => {
    return {
        id: id || null,
        name: name || '',
        num: num || '',
        date: date || null,
        control_date: control_date || null
    }
};

// Element component
export class EOrganizationControl extends React.Component {

    render() {
        const {fields, disabled} = this.props
        const add = () => fields.push(getRow());
        const rmv = (ind) => () => fields.remove(ind);
        const ROWS = fields.map((x, i) => (<tr key={i}>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FAutocomplete} name={x + M.ORG_NAME.name} value={x[M.ORG_NAME.name]}  dataKey={M.ORG_NAME.key}/>
                </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                     <Field disabled={disabled} component={FInput} name={x + M.ISH_NUM.name} value={x[M.ISH_NUM.name]}/>
                </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FPicker} name={x + M.ISH_DATE.name} value={x[M.ISH_DATE.name]} datepicker='+'/>
                </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FPicker} name={x + M.CONTR_DATE.name} value={x[M.CONTR_DATE.name]} datepicker='+'/>
                </span>
            </td>
            <td>
                {disabled ? null :
                    <Button size="small" type="text" onClick={rmv(i)}>
                        <i className="el-icon-close color-red-dark"/>
                    </Button>
                }
            </td>
        </tr>)); //

        return (
            <React.Fragment>
                {!fields.length ?
                    <p className='mt-neg18 mb18 txt-em color-gray'>Нет добавленных организаций</p>
                    :
                    <table>
                        <thead>
                        <tr>
                            <th className='ap-table__header'>{M.ORG_NAME.label}</th>
                            <th className='ap-table__header'>{M.ISH_NUM.label}</th>
                            <th className='ap-table__header'>{M.ISH_DATE.label}</th>
                            <th className='ap-table__header'>{M.CONTR_DATE.label}</th>
                        </tr>
                        </thead>


                        <tbody>
                        {ROWS}
                        </tbody>
                    </table>
                }

                {disabled ? null :
                    <Button size="small" icon="plus" type="success" plain={true} onClick={add}
                            className="flex-parent mb18"
                            title='Добавить тему'>Добавить</Button>
                }
            </React.Fragment>
        )
    }//
}
