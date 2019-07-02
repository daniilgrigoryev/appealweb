import React from 'react'
import * as _ from 'lodash'
import {Button} from 'element-react'
import {Field, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as V from '../../../validators'

import mapping from '../mapping.js'

const M = mapping.apnList;

const getRow = (id,apn, date) => {
    return {
        id: id || null,
        apn: apn || null,
        date: date || null
    }
}

// Element component
export class EApnList extends React.Component {

    render() {
        const {fields, disabled} = this.props
        const add = () => fields.push(getRow());
        const rmv = (ind) => () => fields.remove(ind);
        const inf = (ind) => () => fields.remove(ind);

        const ROWS = fields.map((x, i) => (<tr key={i}>
            <td>
                <span className='ap-table-list-number mr12'>{i + 1}</span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FInput} name={x + M.POST_NUM.name} value={x[M.POST_NUM.name]} className="w240"/>
                </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FPicker} name={x + M.DATE.name} value={x[M.DATE.name]} date='+'/>
                </span>
            </td>
            <td>
               <span className="">
                    {disabled ? null :
                        <Button type="text" onClick={inf(i)}>
                            <i className="el-icon-information color-blue"/>
                        </Button>}

                   {disabled ? null :
                       <Button size="small" type="text" onClick={rmv(i)}>
                           <i className="el-icon-close color-red-dark"/>
                       </Button>}
               </span>
            </td>
        </tr>));

        return (
            <React.Fragment>
                {!fields.length 
                    ? <p className='mb18 txt-em color-gray'>Нет добавленных постановлений</p>
                    : <table>
                        <thead>
                        <tr>
                            <th colSpan='2' className='ap-table__header'>{M.POST_NUM.label}</th>
                            <th className='ap-table__header'>{M.DATE.label}</th>
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
                            title='Добавить тему'>Добавить</Button>}
            </React.Fragment>
        );
    }//
}
