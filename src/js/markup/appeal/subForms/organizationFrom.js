import React from 'react'
import {FInput, EInput} from '../../components/finput.js'
import { Field, reduxForm } from 'redux-form/immutable'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import * as V from '../../../validators'

const getRow = (name,num,date)=>{
  return {
    id: _.uniqueId('orc'),
    name: name || '',
    num:  num  || '',
    date: date || null
  }
}

// Element component
export class EOrganizationFrom extends React.Component {

  render() {
    const {fields,disabled} = this.props
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const ROWS = fields.map((x,i)=>(<tr key={i} >
            <td><Field disabled={disabled} component={FInput} name={x+'name'} value={x.name}  /></td>
            <td><Field disabled={disabled} component={FInput} name={x+'num'}  value={x.num}  /></td>
            <td><Field disabled={disabled} component={FPicker} name={x+'date'} value={x.date} datepicker='+' /></td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (
      <table>
        <thead>
          <tr>
            <th>Наименование</th>
            <th>Исходящий номер</th>
            <th>Исходящая дата</th>
            <th>{disabled ? null : <button type="button" onClick={add} title='Добавить организацию'>+</button>}</th>
          </tr>
        </thead>
        <tbody>
          {ROWS}          
        </tbody>
      </table>
    )
  }//
}