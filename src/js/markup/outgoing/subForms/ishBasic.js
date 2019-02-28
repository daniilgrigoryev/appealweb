 import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../components/finput.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import mapping from '../mapping.js' 

const M = mapping.ishBasic;

 class IshBasic extends React.Component {

  render() {  
    const {disabled} = this.props
    return (
      <div style={{background:'#ffe5f8'}}>
        <table>
          <tbody>
            <tr>
              <td>{M.VID_DOC.label}</td>
              <td colSpan='3'><Field disabled={disabled} component={FSelect} name={M.VID_DOC.name} dataKey={M.VID_DOC.key}  /></td>
            </tr>
            <tr>
              <td>{M.SUMMARY.label}</td>
              <td colSpan='3'><Field disabled={disabled} component={FInput} name={M.SUMMARY.name}   /></td>
            </tr>
            <tr>
              <td>{M.NOTES.label}</td>
              <td colSpan='3'><Field disabled={disabled} component={FInput} name={M.NOTES.name} textarea='+'   /></td>
            </tr>
            <tr>
              <td>{M.DELIV_TYPE.label}</td>
              <td><Field disabled={disabled} component={FSelect} name={M.DELIV_TYPE.name} dataKey={M.DELIV_TYPE.key}    /></td>
           	  <td>{M.SHEETS_COUNT.label}</td>
              <td><Field disabled={disabled} component={FInput} name={M.SHEETS_COUNT.name} /></td>
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
})(IshBasic)