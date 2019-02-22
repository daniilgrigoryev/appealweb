import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../components/finput.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'

const getRow = (npost,date)=>{
  return {
    id: _.uniqueId('npost'),
    npost: npost || '',
    date: date || null
  }
}

const posts = (props)=>{
    const {fields,disabled} = props
    const add = ()=>fields.push(getRow());
    const rmv = (ind)=>()=>fields.remove(ind);
    const inf = (ind)=>()=>fields.remove(ind); // ! replace me
    const ROWS = fields.map((x,i)=>(
          <tr key={i} >
            <td><Field disabled={disabled} component={FInput}  name={x+'npost'}  value={x.npost}  /></td>
            <td><Field disabled={disabled} component={FPicker} name={x+'date'}  value={x.date}  /></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (<table>
              <tbody>
                <tr>
                  <td>№</td>
                  <td>Дата</td>
                  <td colSpan='2'>{disabled ? null : <button type='button' onClick={add}>+</button>}</td>
                </tr>
                {ROWS}
              </tbody>
            </table>);
} //

class IshLinkPost extends React.Component {

  render() {  
    const {disabled} = this.props
    return (
      <div style={{background:'#d8ffda'}}>
        <h2>Постановления</h2>
        <FieldArray name='posts' component={posts} disabled={disabled} />
      </div>
    )
  }//
}

export default reduxForm({
  form: 'outgoing', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(IshLinkPost)