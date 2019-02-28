import React from 'react'
import {FInput, EInput} from '../../components/finput.js'
import {Field, reduxForm} from 'redux-form/immutable'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import * as V from '../../../validators'
import {Button} from 'element-react'

import mapping from '../appealContent/mapping.js'

const M = mapping.apnList;

const getRow = (apn, date) => {
    return {
        id: _.uniqueId('qlr'),
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
                <span className='ap-table-list-number mr12'>
                {i + 1}
                 </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FInput} name={x + M.POST_NUM.name} value={x[M.POST_NUM.name]}/>
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
                        </Button>
                    }

                   {disabled ? null :
                       <Button type="text" onClick={rmv(i)}>
                           <i className="el-icon-delete color-red-dark"/>
                       </Button>
                   }
               </span>
            </td>
        </tr>));

        return (
            <React.Fragment>
                {!fields.length ?
                    <p className='mt-neg12 mb18 txt-em txt-s color-gray-light'>Нет добавленных постановлений</p>
                    :
                <table>
                        <thead>
                        <tr>
                            <th colSpan='2' className='ap-table-header'>{M.POST_NUM.label}</th>
                            <th className='ap-table-header'>{M.DATE.label}</th>
                        </tr>
                        </thead>

                    <tbody>
                    {ROWS}
                    </tbody>
                </table>
                }

                {disabled ? null :
                    <Button size="small" icon="plus" onClick={add}
                            className="flex-parent mb18"
                            title='Добавить тему'>Добавить</Button>
                }
            </React.Fragment>
        );
    }//
}