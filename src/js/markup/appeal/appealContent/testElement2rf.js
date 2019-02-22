import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../../components/finput.js'
import {EAutocomplete,FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../../components/checkbox.js'
import {ESwitch,FSwitch} from '../../components/switch.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import {ERadio,FRadio} from '../../components/radio.js'
import * as V from '../../../validators'

const header = 'Ejs 2 reduxF test';

const TestElement2RF = props => {
  const { handleSubmit, pristine, nextPage, prevPage, submitting,disabled } = props
  
  const fields = [
    /*{ 
      name: 'EDO_NUM4', 
      label:'Номер в ЭДО'
    },{ 
      name: 'REQUEST_T4YPE', 
      label:'Способ подачи обращения'
    },{ 
      name: 'ECOO5_NUM', 
      label:'Номер в ЕСОО'
    },{ 
      name: 'RESPONSE_TY6PE', 
      label:'Способ направления ответа'
    },*/{ 
      name: 'SHEETS_COUNT21', 
      label:'Количество листов'
    }
  ].map(x=>(x.type=x.type||'text',x));


  const CONTENT = fields.map((f)=><tr key={f.name}><td>{f.label}</td><td><Field disabled={disabled} name={f.name} component={FInput} className='zzz22' validate={[V.required]} /></td></tr>) //
  const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
 
  const radioOptions = [
    {
      property: 111,
      value: '111'
    },{
      property: 222,
      value: '222'
    },{
      property: 333,
      value: '333'
    }
  ];

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <tbody>
          {CONTENT}
          <tr>
            <td>ac</td>
            <td><Field disabled={disabled}  name='autocompl' placeholder='123' key='2344' component={FAutocomplete} validate={[V.required]} /></td>
          </tr>
          <tr>
            <td>телефон с маской</td>
            <td><Field disabled={disabled} component={FInput} placeholder='123' key='phone' className='phone22' name='phonemask' mask={phoneMask} validate={[V.required]} /></td>
          </tr>
          <tr>
            <td>чекбокс</td>
            <td><Field disabled={disabled} component={FCheckbox} name='checkbox' key='chch' checked/></td>
          </tr>
           <tr>
            <td>свитч</td>
            <td><Field disabled={disabled} component={FSwitch} name='switch' /></td>
          </tr>
          <tr>
            <td>селект</td>
            <td><Field disabled={disabled} component={FSelect} name='select' dataKey='123' placeholder='Select' validate={[V.required]} /></td>
          </tr>
          <tr>
            <td>время</td>
            <td><Field disabled={disabled} component={FPicker} name='timepicker' timepicker='+' placeholder='timepicker' validate={[V.required]}   /></td>
            <td><EPicker timepicker='+' /></td>
          </tr>

          <tr>
            <td>дата</td>
            <td><Field disabled={disabled} component={FPicker} name='datepicker' datepicker='+' placeholder='datepicker' validate={[V.required]} /></td>
            <td><EPicker datepicker='+' /></td>
          </tr>
          <tr>
            <td>датавремя</td>
            <td><Field disabled={disabled} component={FPicker} name='datetimepicker' datetimepicker='+' placeholder='datetimepicker' validate={[V.required]}   /></td>
            <td><EPicker datetimepicker='+' /></td>
          </tr>
          <tr>
            <td>радио</td>
            <td><Field disabled={disabled} component={FRadio} name='radio' options={radioOptions} /></td>
            <td><ERadio options={radioOptions} /></td>
          </tr>

        </tbody>
      </table>

      <div>
        <button type="button" className="previous" onClick={prevPage}>Previous</button>
        <button type="submit" onClick={nextPage} >Submit</button>
      </div>
    </form>
  )
}

export default reduxForm({
  form: 'appeal', // <------ same form name                       disabled={pristine || submitting}
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(TestElement2RF)