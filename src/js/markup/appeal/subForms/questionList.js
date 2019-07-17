import React from 'react'
import * as _ from 'lodash'
import {Field, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as V from '../../../validators'
import {Button, Card, Layout, Tag} from 'element-react'
import mapping from '../mapping.js'
import Immutable from 'immutable'

const im = (obj) => Immutable.fromJS(obj);

const M = mapping.questionList;

const getRow = (id,question, department,control_date) => {
    return im({
        id: id||null,
        question: question || null,
        department: department || null,
        control_date: control_date || null
    })
}

const dateBoundary = (time, borderTime) =>{
    let checkingDate = new Date(borderTime);
    if(checkingDate instanceof Date && time instanceof Date && !isNaN(checkingDate.getTime())){
        checkingDate.setDate(checkingDate.getDate() + 30);
        return time.getTime() > checkingDate.getTime();
    }else{
        return false;
    }
};
// Element component
export class EQuestionList extends React.Component {

    render() {
        const {fields, disabled, checkingDate} = this.props
        const add = () => fields.push(getRow());
        const rmv = (ind) => () => fields.remove(ind);

        const ROWS = fields.map((x, i, arr) =>(
        <div className="row" key={i}>
            <div className="column w240">
                <div className="label">{M.QUEST.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FSelect} name={x + M.QUEST.name} value={x[M.QUEST.name]} dataKey={M.QUEST.key}/>
                </div>
            </div>
            <div className="column w130">
                <div className="label">{M.DEPART.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FSelect} name={x + M.DEPART.name} value={x[M.DEPART.name]} dataKey={M.DEPART.key} dbVisibleVal={arr.get(i).get('org_label')}/>
                </div>
            </div>
            <div className="column w130">
                <div className="label">Резолюция</div>
                <div className="value">
                    <Field disabled={disabled} component={FPicker} name={x + 'control_date'} datepicker='+' disabledDate={time=>dateBoundary(time, checkingDate)}/>
                </div>
            </div>
            <div className="column w130">
                <div className="label">Типы резолюций</div>
                <div className="value">
                    <Field disabled={disabled} component={FSelect} name={x + 'type_resolution'} value={x['type_resolution']} dataKey={null}/>
                </div>
            </div>
            <div className="column w300">
                <div className="label">Комментарий</div>
                <div className="value">
                    <Field disabled={disabled} component={FInput} autosize={{ minRows: 0, maxRows: 4}} name={x + 'description'} value={x['description']} type="textarea" style={{'height':'32px'}}/>
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
                    <div className="flex-table ml0">{ROWS}</div>
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
