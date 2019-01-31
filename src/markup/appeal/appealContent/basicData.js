import React from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import Finput from '../element2rform/finput.js'
import Fautocomplete from '../element2rform/fautocomplete.js'

const BasicData = props => {
  const { handleSubmit, pristine, previousPage, submitting } = props
  
  const fields = [
    { 
      name: 'EDO_NUM', 
      label:'Номер в ЭДО'
    },{ 
      name: 'REQUEST_TYPE', 
      label:'Способ подачи обращения'
    },{ 
      name: 'ECOO_NUM', 
      label:'Номер в ЕСОО'
    },{ 
      name: 'RESPONSE_TYPE', 
      label:'Способ направления ответа'
    },{ 
      name: 'SHEETS_COUNT', 
      label:'Количество листов'
    }
  ].map(x=>(x.type=x.type||'text',x));


  const CONTENT = fields.map(f=>(<Field {...f} key={f.name} component={Finput} />)); //

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <tbody>
          {CONTENT}
          <tr>
            <td>ac</td>
            <td><Fautocomplete placeholder='123' /></td>
          </tr>
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
})(BasicData)