import React from 'react'
import { FieldArray, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../../components/finput.js'
import {EAutocomplete,FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../../components/checkbox.js'
import {ESwitch,FSwitch} from '../../components/switch.js'
import {ESelect,FSelect} from  '../../components/select.js'
import {EPicker,FPicker} from '../../components/picker.js'
import {EIshDocList,FIshDocList} from '../subForms/ishDocList.js'
import mapping from './mapping.js'

const header = 'Исходящие документы';

const IshDocsData = props => {
    const { handleSubmit, pristine, nextPage, prevPage, submitting, disabled } = props
    
    return (
       <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>

            <FieldArray name='ishDocsData' component={FIshDocList} disabled={disabled} />    

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
})(IshDocsData)