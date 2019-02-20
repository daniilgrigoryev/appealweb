import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {getSessionId} from '../../selectors/common.js'
import CrudTable from '../table/crudTable.js'
import * as F from '../table/fields.js'
import FabulasDocSections from './fabulasDocSections.js'

const title='Фабулы документов'

const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
 
const fields = [
	F.str('label','Название'),
	F.str('type','Тип'),
	F.dat('changed','Дата изменения',{ noEdit:true}),
	F.radStr('zajav','Заявитель',    { noTable:true,
									   radio:[  {value: 'Физическое лицо' ,property: 'FL'},
										        {value: 'Юридическое лицо',property: 'UL'}
	]}),
	F.fil('templ','Файл шаблона', { noTable:true})
]

class FabulasTest extends React.Component {
  render() {
    return <CrudTable sid={this.props.sid} fields={fields} columns={3} editor={FabulasDocSections} title={title} />;
  }//
}

const state2props = (state) => {
  return {sid: getSessionId(state)};
}

export default connect(state2props)(FabulasTest);