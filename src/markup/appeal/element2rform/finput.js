import React from 'react'
import {Input} from 'element-react'

const Finput = ({ input, label, type, meta: { touched, error } }) => (
  <tr>
    <td>{label}</td>
    <td>
      <Input {...input} placeholder={label} />
    </td>
    <td>  
      {touched && error && <span>{error}</span>}
    </td>
  </tr>
) //

export default Finput