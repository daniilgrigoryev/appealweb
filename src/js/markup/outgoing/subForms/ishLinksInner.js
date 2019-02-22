import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../components/finput.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'

const getRow = (npost,desc,docId)=>{
  return {
    id: _.uniqueId('ldocs'),
    desc: desc || '',
    docId: docId || null 
  }
}

const linkedDocs = (props)=>{
    const {fields,disabled} = props
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const inf = (ind)=>()=>fields.remove(ind); // ! replace me
    const ROWS = fields.map((x,i)=>(
          <tr key={i} >
            <td><Field disabled={disabled} component={FInput} name={x+'dodId'} value={x.dodId} disabled={true} /></td>
            <td><Field disabled={disabled} component={FInput} name={x+'desc'}  value={x.desc}  disabled={true} /></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (<table>
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>Описание</td>
                  <td colSpan='2'>{disabled ? null : <button type='button' onClick={add}>Связать</button>}</td>
                </tr>
                {ROWS}
              </tbody>
            </table>);
} //

class IshLinkInner extends React.Component {
  render() {  
    const {disabled} = this.props
    return (
      <div style={{background:'#d4fbfc'}}>
        <h2>Связанные документы</h2>
        <FieldArray name='linkedDocs' component={linkedDocs} disabled={disabled} />
      </div>
    )
  }//
}

export default reduxForm({
  form: 'outgoing', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(IshLinkInner)