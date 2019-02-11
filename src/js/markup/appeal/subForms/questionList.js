import React from 'react'
import {FInput, EInput} from '../element2rform/finput.js'
import { Field, reduxForm } from 'redux-form/immutable'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import * as _ from 'lodash'
import * as V from '../../../validators'

const getRow = (question,department)=>{
  return {
    id: _.uniqueId('qlr'),
    question: question || null,
    department: department || null
  }
}

// Element component
export class EQuestionList extends React.Component {

  render() {
    const {fields} = this.props
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const ROWS = fields.map((x,i)=>(<tr key={i} >
            <td>{i+1}</td>
            <td><Field component={FSelect} name={x+'question'}   value={x.question} dataKey='questions'  /></td>
            <td><Field component={FSelect} name={x+'department'} value={x.department} dataKey='departments'  /></td>
            <td><button type='button' onClick={rmv(i)}>x</button></td>
          </tr>)); //

    return (
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Тематика обращения</th>
            <th>Отдел</th>
            <th><button type="button" onClick={add} title='Добавить тематику обращения'>+</button></th>
          </tr>
        </thead>
        <tbody>
          {ROWS}          
        </tbody>
      </table>
    )
  }//
}