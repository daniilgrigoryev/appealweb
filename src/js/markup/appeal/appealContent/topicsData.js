import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ETopicList,FTopicList} from '../subForms/topicList.js'
import mapping from './mapping.js'

const TopicsData = props => {
    const { handleSubmit, pristine, previousPage, submitting, header } = props
    const M = mapping.TopicsData;

    return (
       <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>

            <Field name='topicsData' component={FTopicList} />    

            <div>
              <button type="button" className="previous" onClick={previousPage}>Previous</button>
              <button type="submit" >Submit</button>
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
})(TopicsData)