import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../../components/finput.js'
import {EAutocomplete,FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../../components/checkbox.js'
import {ESwitch,FSwitch} from '../../components/switch.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import mapping from './mapping.js'

const header = 'Архивная информация';
const M = mapping.archive;
    
const ArchiveData = props => {
    const { handleSubmit, pristine, nextPage, prevPage, submitting, header,disabled } = props
    return (
      <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>            
            <table>
              <tbody>
                <tr>
                  <td>{M.TOM.label}</td>
                  <td><Field disabled={disabled} name={M.TOM.name} component={FInput} /></td>
                </tr>
                <tr>
                  <td>{M.SHEETS.label}</td>
                  <td><Field disabled={disabled} name={M.SHEETS.name} component={FInput} /></td>
                </tr>                
              </tbody>
            </table>

            <div>
            {disabled 
              ? null 
              : (<div>
                  <button type="button" onClick={prevPage}>Previous</button>
                  <button type="submit" onClick={nextPage}>Submit</button>
                </div>)
            }
            </div>
          </form>
        </div>
      </div>
    )
} //

export default reduxForm({
  form: 'appeal', // <------ same form name                       disabled={pristine || submitting}
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(ArchiveData)