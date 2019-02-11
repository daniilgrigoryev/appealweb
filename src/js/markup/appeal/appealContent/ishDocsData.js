import React from 'react'
import { FieldArray, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {EIshDocList,FIshDocList} from '../subForms/ishDocList.js'
import mapping from './mapping.js'

const IshDocsData = props => {
    const { handleSubmit, pristine, nextPage, prevPage, submitting, header } = props
    
    return (
       <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>

            <FieldArray name='ishDocsData' component={FIshDocList} />    

            <div>
              <button type="button" className="previous" onClick={prevPage}>Previous</button>
              <button type="submit" onClick={nextPage} >Submit</button>
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