import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../../components/finput.js'
import {ESelect,FSelect} from  '../../../components/select.js'
import {EPicker,FPicker} from '../../../components/picker.js'
import * as _ from 'lodash'
import mapping from '../mapping.js' 

const M = mapping.incLinksScan;

const getRow = (npost,desc,docId,content)=>{
  return {
    id: _.uniqueId('ldocs'),
    desc: desc || '',
    docId: docId || null,
    content: content || null
  }
}

const scannedDocs = (props)=>{
    const {fields,disabled} = props
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const inf = (ind)=>()=>fields.remove(ind); // ! replace me
    const ROWS = fields.map((x,i)=>(
          <tr key={i} >
            <td><Field disabled={disabled} component={FInput} name={x+M.ID.name} value={x[M.ID.name]} disabled={true} /></td>
            <td><Field disabled={disabled} component={FInput} name={x+M.DESC.name}  value={x[M.DESC.name]}  disabled={true} /></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (<table>
              <tbody>
                <tr>
                  <td>{M.ID.label}</td>
                  <td>{M.DESC.label}</td>
                  <td>{disabled ? null : <button type='button' onClick={add}>Загрузить</button>}</td>
                  <td>{disabled ? null : <button type='button' onClick={add}>Сканировать</button>}</td>
                </tr>
                {ROWS}
              </tbody>
            </table>);
} //

class IncLinkScan extends React.Component {
  render() {  
    const {disabled} = this.props
    return (
      <div style={{background:'#ffadad'}}>
        <h2>{M.SCAN_DOC.label}</h2>
        <FieldArray name={M.SCAN_DOC.name} component={scannedDocs} disabled={disabled} />
      </div>
    )
  }//
}

export default reduxForm({
  form: 'letter_incoming', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(IncLinkScan)