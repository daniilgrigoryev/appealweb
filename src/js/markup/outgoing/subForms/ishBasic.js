 import React from 'react'
import { Field,FieldArray, reduxForm } from 'redux-form/immutable'
import {FInput, EInput}  from '../../components/finput.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import * as _ from 'lodash'

 class IshBasic extends React.Component {

  render() {  
    const {disabled} = this.props
    return (
      <div style={{background:'#ffe5f8'}}>
        <table>
          <tbody>
            <tr>
              <td>Вид документа</td>
              <td colSpan='3'><Field disabled={disabled} component={FSelect} name='vidDoc' dataKey='doc_vid'  /></td>
            </tr>
            <tr>
              <td>Краткое содержание</td>
              <td colSpan='3'><Field disabled={disabled} component={FInput} name='summary'   /></td>
            </tr>
            <tr>
              <td>Примечание</td>
              <td colSpan='3'><Field disabled={disabled} component={FInput} name='notes' textarea='+'   /></td>
            </tr>
            <tr>
              <td>Способ доставки</td>
              <td><Field disabled={disabled} component={FSelect} name='deliveryType' dataKey='delivery_type'    /></td>
           	  <td>Кол-во листов</td>
              <td><Field disabled={disabled} component={FInput} name='sheetsCount' /></td>
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