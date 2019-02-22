import React from 'react'
import {FInput, EInput} from '../../components/finput.js'
import { Field, reduxForm } from 'redux-form/immutable'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import * as V from '../../../validators'

const getRow = (apn,date)=>{
  return {
    id: _.uniqueId('qlr'),
    apn: apn || null,
    date: date || null
  }
}

// Element component
export class EApnList extends React.Component {

  render() {
    const {fields,disabled} = this.props
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const inf = (ind)=>()=>fields.remove(ind);
    const ROWS = fields.map((x,i)=>(<tr key={i} >
            <td><Field disabled={disabled} component={FInput}  name={x+'apn'}  value={x.apn}  /></td>
            <td><Field disabled={disabled} component={FPicker} name={x+'date'} value={x.date} date='+' /></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (
      <table>
        <thead>
          <tr>
            <th>№ постановления</th>
            <th>Дата</th>
            <th colSpan='2'>
              {disabled ? null : <button type="button" onClick={add} title='Добавить № постановления'>+</button>}
            </th>
          </tr>
        </thead>
        <tbody>
          {ROWS}          
        </tbody>
      </table>
    )
  }//
}