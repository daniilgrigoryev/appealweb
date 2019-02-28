import React from 'react'
import {FInput, EInput} from '../../components/finput.js'
import {Field, reduxForm} from 'redux-form/immutable'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import * as V from '../../../validators'
import {Button, Card, Layout, Tag} from 'element-react'

import mapping from '../appealContent/mapping.js'

const M = mapping.questionList;

const getRow = (question, department) => {
    return {
        id: _.uniqueId('qlr'),
        question: question || null,
        department: department || null
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
                <span className='ap-table-list-number mr12'>
                {i + 1}
                 </span>
            </td>
            <td>
                 <span className='inline-block mr12'>
                     <Field disabled={disabled} component={FSelect} name={x + M.QUEST.name} value={x[M.QUEST.name]}
                            dataKey={M.QUEST.key}/>
                      </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FSelect} name={x + M.DEPART.name} value={x[M.DEPART.name]}
                           dataKey={M.DEPART.key}/>
                    </span>
            </td>
            <td>{disabled ? null :
                <Button type="danger" size="mini" onClick={rmv(i)}>
                    <i className="el-icon-delete"/>
                </Button>}
            </td>
        </tr>));

        return (
            <React.Fragment>
                <table>
                    {!fields.length ? null :
                        <thead>
                        <tr>
                            <th className='ap-table-header'>№</th>
                            <th className='ap-table-header'>{M.QUEST.label}</th>
                            <th className='ap-table-header'>{M.DEPART.label}</th>
                        </tr>
                        </thead>
                    }

                    <tbody>
                    {ROWS}
                    </tbody>
                </table>

                {disabled ? null :
                    <Button type="success" size="mini" icon="plus" onClick={add}
                            className="flex-parent mt-neg6 mb18"
                            title='Добавить тематику обращения'>Добавить</Button>
                }
            </React.Fragment>
        )
    }//
}