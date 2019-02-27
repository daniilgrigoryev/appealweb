import React from 'react'
import {FInput, EInput} from '../../components/finput.js'
import { Field, reduxForm } from 'redux-form/immutable'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import * as V from '../../../validators'
import mapping from '../appealContent/mapping.js' 

const M = mapping.organizationFrom;


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
            <td><Field disabled={disabled} component={FInput} name={x+M.ORG_NAME.name} value={x[M.ORG_NAME.name]}  /></td>
            <td><Field disabled={disabled} component={FInput} name={x+M.ISH_NUM.name}  value={x[M.ISH_NUM.name]}  /></td>
            <td><Field disabled={disabled} component={FPicker} name={x+M.ISH_DATE.name} value={x[M.ISH_DATE.name]} datepicker='+' /></td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (
      <table>
        <thead>
          <tr>
            <th>{M.ORG_NAME.label}</th>
            <th>{M.ISH_NUM.label}</th>
            <th>{M.ISH_DATE.label}</th>
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