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

        const ROWS = fields.map((x, i, arr) =>(
        <div className="row" key={i}>
            <div className="column w300">
                <div className="label">{M.QUEST.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FSelect} name={x + M.QUEST.name} value={x[M.QUEST.name]} dataKey={M.QUEST.key}/>
                </div>
            </div>
            <div className="column w180">
                <div className="label">{M.DEPART.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FSelect} name={x + M.DEPART.name} value={x[M.DEPART.name]} dataKey={M.DEPART.key} dbVisibleVal={arr.get(i).get('org_label')}/>
                </div>
            </div>
            <div className="column w130">
                <div className="label">Дата контроля</div>
                <div className="value">
                    <Field disabled={disabled} component={FPicker} name={x + 'control_date'} datepicker='+' />
                </div>
            </div>
            <div className="column column--end">
                <div className="value">
                    {disabled ? null :
                        <Button className="py0" size="small" type="text" onClick={rmv(i)}>
                            <i className="ico round minus"/>
                        </Button>
                    }
                    {disabled ? null : 
                        <Button className="py0" size="small" type="text" onClick={add}>
                            <i className="ico round plus"/>
                        </Button>
                    }
                </div>
            </div>
        </div>));

        return (
            <React.Fragment>
                {!fields.length ?
                    <p className='my6 txt-em color-gray align-center'>Нет добавленных тематик обращения</p>
                    :
                    <div className="flex-table">{ROWS}</div>
                }

                {disabled || fields.length ? null :
                    <Button size="small" icon="plus" plain={true} onClick={add}
                            className="flex-parent my6 mx-auto block"
                            title='Добавить тему'>Добавить</Button>
                }
            </React.Fragment>
        )
    }//
}
