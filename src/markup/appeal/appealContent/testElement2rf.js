import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ERadio,FRadio} from '../element2rform/radio.js'

const TestElement2RF = props => {
  const { handleSubmit, pristine, previousPage, submitting } = props
  
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


  const CONTENT = fields.map((f)=><tr key={f.name}><td>{f.label}</td><td><Field name={f.name} component={FInput} /></td></tr>) //
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
            <td><Field  name='autocompl' placeholder='123' key='2344' component={FAutocomplete}  /></td>
          </tr>
          <tr>
            <td>телефон с маской</td>
            <td><Field component={FInput} placeholder='123' key='phone' name='phonemask' mask={phoneMask} /></td>
          </tr>
          <tr>
            <td>чекбокс</td>
            <td><Field component={FCheckbox} name='checkbox' key='chch' checked/></td>
          </tr>
           <tr>
            <td>свитч</td>
            <td><Field component={FSwitch} name='switch' /></td>
          </tr>
          <tr>
            <td>селект</td>
            <td><Field component={FSelect} name='select' dataKey='123' placeholder='Select' /></td>
          </tr>
          <tr>
            <td>время</td>
            <td><Field component={FPicker} name='timepicker' timepicker='+' placeholder='timepicker' /></td>
            <td><EPicker timepicker='+' /></td>
          </tr>

          <tr>
            <td>дата</td>
            <td><Field component={FPicker} name='datepicker' datepicker='+' placeholder='datepicker' /></td>
            <td><EPicker datepicker='+' /></td>
          </tr>
          <tr>
            <td>датавремя</td>
            <td><Field component={FPicker} name='datetimepicker' datetimepicker='+' placeholder='datetimepicker' /></td>
            <td><EPicker datetimepicker='+' /></td>
          </tr>
          <tr>
            <td>радио</td>
            <td><Field component={FRadio} name='radio' options={radioOptions} /></td>
            <td><ERadio options={radioOptions} /></td>
          </tr>

        </tbody>
      </table>

      <div>
        <button type="button" className="previous" onClick={previousPage}>
          Previous
        </button>
        <button type="submit" >
          Submit
        </button>
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