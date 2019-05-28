import React from 'react'
import * as _ from 'lodash'
import {Field, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as V from '../../../validators'
import {Button, Card, Layout, Tag} from 'element-react'

import mapping from '../mapping.js'

const M = mapping.questionList;

const getRow = (id,question, department,control_date) => {
    return {
        id: id||null,
        question: question || null,
        department: department || null,
        control_date: control_date || null
    }
}

// Element component
export class EQuestionList extends React.Component {

    render() {
        const {fields, disabled} = this.props
        const add = () => fields.push(getRow());
        const rmv = (ind) => () => fields.remove(ind);
        const ROWS = fields.map((x, i) => (<tr key={i}>
            <td>
                <span className='ap-table-list-number mr12'>{i + 1}</span>
            </td>
            <td>
                 <span className='inline-block mr12'>
                     <Field disabled={disabled} component={FSelect} name={x + M.QUEST.name} value={x[M.QUEST.name]} dataKey={M.QUEST.key} readOnly />
                 </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FSelect} name={x + M.DEPART.name} value={x[M.DEPART.name]} dataKey={M.DEPART.key} readOnly/>
                </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FPicker} name={x + 'control_date'} datepicker='+' />
                </span>
            </td>
            <td>{disabled ? null :
                <Button size="small" type="text" onClick={rmv(i)}>
                    <i className="el-icon-close color-red-dark"/>
                </Button>
            }
            </td>
        </tr>)); //

        return (
            <React.Fragment>
                {!fields.length ?
                    <p className='mt-neg18 mb18 txt-em color-gray'>Нет добавленных тематик обращения</p>
                    :
                    <table>
                        <thead>
                        <tr>
                            <th className='ap-table__header'>№</th>
                            <th className='ap-table__header'>{M.QUEST.label}</th>
                            <th className='ap-table__header'>{M.DEPART.label}</th>
                            <th className='ap-table__header'>Дата контроля</th>
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
