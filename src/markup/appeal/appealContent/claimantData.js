import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import Finput from '../element2rform/finput.js'

const ClaimantData = props => {
  const { handleSubmit, pristine, previousPage, submitting } = props
  
  const fields = [
    { 
      name: 'FAM', 
      label:'Фамилия'
    },{ 
      name: 'NAME', 
      label:'Имя'
    },{ 
      name: 'SURNAME', 
      label:'Отчество'
    },{ 
      name: 'PHONE', 
      label:'Телефон'
    },{ 
      name: 'EMAIL', 
      label:'Эектронная почта'
    }
  ].map(x=>(x.type=x.type||'text',x));


  const CONTENT = fields.map(f=>(<Field {...f} component={Finput} />)); //

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <tbody>
          {CONTENT}
        </tbody>
      </table>

      <div>
        <button type="button" className="previous" onClick={previousPage}>
          Previous
        </button>
        <button type="submit" disabled={pristine || submitting}>
          Submit
        </button>
      </div>
    </form>
  )
}


export default reduxForm({
  form: 'appeal', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(ClaimantData)