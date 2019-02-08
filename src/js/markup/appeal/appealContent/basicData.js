import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import mapping from './mapping.js'

const  BasicData = props => {
    const { nextPage,handleSubmit,previousPage, header } = props
    const M = mapping.basicData;
    return (
      <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
            <form onSubmit={handleSubmit}>
            <table>
              <tbody>
                <tr>
                  <td>{M.EDO_NUM.label}</td>
                  <td><Field component={FInput} name={M.EDO_NUM.name} /></td>
                </tr>
                <tr>
                  <td>{M.REQUEST_TYPE.label}</td>
                  <td><Field component={FSelect} name={M.REQUEST_TYPE.name} dataKey={M.REQUEST_TYPE.key} placeholder='Выбор' /></td>
                </tr>
                <tr>
                  <td>{M.ECOO_NUM.label}</td>
                  <td><Field component={FInput} name={M.ECOO_NUM.name} /></td>
                </tr>
                <tr>
                  <td>{M.RESPONSE_TYPE.label}</td>
                  <td><Field component={FSelect} name={M.RESPONSE_TYPE.name} dataKey={M.RESPONSE_TYPE.key} placeholder='Выбор' /></td>
                </tr>
                <tr>
                  <td>{M.SHEETS_COUNT.label}</td>
                  <td><Field component={FInput} name={M.SHEETS_COUNT.name} /></td>
                </tr>
              </tbody>
            </table>

            <div>
              <button type="button" onClick={previousPage}>Previous</button>
              <button type="submit" onClick={nextPage}>Submit</button>
            </div>
            </form>
        </div>
      </div>
    )
} //

export default reduxForm({
  form: 'appeal', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(BasicData)