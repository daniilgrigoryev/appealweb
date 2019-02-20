import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {getSessionId} from '../../selectors/common.js'
import CrudTable from '../table/crudTable.js'
import * as F from '../table/fields.js'

const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
 
const fields = [
	F.str('label','Название'),
	F.str('type','Тип'),
	F.dat('changed','Дата изменения'),

	F.str('select','Селект',{selectData:['вариант1','вариант2','вариант3','вариант4','вариант5','вариант6']}),

	F.chk('archive','Архив',{checkBox:true}),
	F.num('count','Количество'),
	F.str('phone','Телефон',{mask:phoneMask}),


	F.radStr('zajav','Заявитель',{radio:[  {value: 'Физическое лицо' ,property: 'FL'},
										   {value: 'Юридическое лицо',property: 'UL'}
								      ]})
]

class ListTest extends React.Component {

  render() {
    return <CrudTable sid={this.props.sid} fields={fields} />;
  }//

}

const state2props = (state) => {
  return {sid: getSessionId(state)};
}

export default connect(state2props)(ListTest);