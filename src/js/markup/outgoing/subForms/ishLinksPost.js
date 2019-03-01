import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../components/finput.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import mapping from '../mapping.js' 

const M = mapping.ishLinksPost;

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
            <td><Field disabled={disabled} component={FInput}  name={x+M.NPOST.name}  value={x[M.NPOST.name]}  /></td>
            <td><Field disabled={disabled} component={FPicker} name={x+M.DATE.name}  value={x[M.DATE.name]}  /></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (<table>
              <tbody>
                <tr>
                  <td>{M.NPOST.label}</td>
                  <td>{M.DATE.label}</td>
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
        <h2>{M.POSTS.label}</h2>
        <FieldArray name={M.POSTS.name} component={posts} disabled={disabled} />
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