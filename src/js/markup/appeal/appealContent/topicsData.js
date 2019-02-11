import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Field, FieldArray, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESwitch,FSwitch} from '../element2rform/switch.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ETopicList,FTopicList} from '../subForms/topicList.js'
import mapping from './mapping.js'

const M = mapping.TopicsData;
    
const TopicsData = props => {
    const { handleSubmit, pristine, nextPage, prevPage, submitting, header, system } = props
    const isMadi = system =='M';
    
    return (
       <div className='appealSection'>
          <h2>{header}</h2>
          <div className='appealContent'>
          <form onSubmit={handleSubmit}>

            <FieldArray name='topicsData' component={FTopicList} />    

            <div>
              <button type="button" onClick={prevPage.bind(isMadi)}>Previous</button>
              <button type="submit" onClick={nextPage.bind(isMadi)} >Submit</button>
            </div>
          </form>
        </div>
      </div>
    )
} //

const mapStateToProps = (state)=>({ system: state.getIn(['general','system']) })

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'appeal', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true // <------ unregister fields on unmount
  //validate
  })
)(TopicsData)