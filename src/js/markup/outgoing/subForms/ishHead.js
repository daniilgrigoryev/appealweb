import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../components/finput.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import mapping from '../mapping.js' 

const M = mapping.ishHead;


const nDoc = ['78-08','78-00']

const getRow = (addr)=>{
  return {
    id: _.uniqueId('addr'),
    addr: addr || null
  }
}

const addressee = (props)=>{
    const {fields,disabled} = props
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const ROWS = fields.map((x,i)=>(
          <tr key={i} >
            <td>{M.TO.label}</td>
            <td><Field disabled={disabled} component={FInput}  name={x+M.ADDR.name}  value={x[M.ADDR.name]}  /></td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (<table>
              <tbody>
                <tr><td colSpan='2'><h2>{M.ADDR.label}</h2></td><td>{disabled ? null : <button type='button' onClick={add}>+</button>}</td></tr>
                {ROWS}
              </tbody>
            </table>);
} //

class IshHead extends React.Component {

  render() {  
    const {disabled} = this.props
    return (
      <div style={{background:'#f8ffbc'}}>
        <table>
          <tbody>
            <tr>
              <td>{M.ZAJAV_NDOC.label}</td>
              <td><Field disabled={disabled} component={FSelect} name={M.DOC_NUM.name} data={nDoc} /></td>
              <td><Field disabled={disabled} component={FInput} name={M.ORDER_NUM.name} /></td>
              <td>{M.DOC_DAT.label}</td>
              <td><Field disabled={disabled} component={FPicker} name={M.DOC_DAT.name} datepicker='+' /></td>
            </tr>
          </tbody>
        </table>
        
        <FieldArray name='addressee' component={addressee} disabled={disabled} />

        <table>
          <tbody>
            <tr>
              <td>{M.SIGNER.label}</td>
              <td><Field disabled={disabled} component={FInput} name={M.SIGNER.name}  /></td>
              <td>{M.EXECUTOR.label}</td>
              <td><Field disabled={disabled} component={FInput} name={M.EXECUTOR.name} /></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }//
}

export default reduxForm({
  form: 'outgoing', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(IshHead)