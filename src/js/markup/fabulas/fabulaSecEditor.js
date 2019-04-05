import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {Button} from 'element-react'
import {EAutocomplete} from '../components/fautocomplete.js'
import {EInput} from '../components/finput.js'
import {getSessionId,getSystem} from '../../selectors/common.js'
import {mpt,get} from '../../services/ajax.js'
import {baseUrl} from '../../services/api.js'

class FabulaSecEditor extends React.Component {
  
    constructor(props){
      super(props);
      this.state = Object.assign({system: props.sys,doc_id: props.doc_id},props.fabSec);

      this.ajax = this.ajax.bind(this);
    }

    setVal(field,value){
      this.setState({[field]:value})
    }

    ajax(alias){
      const {reloadParent,cancelEdit} = this.props;
      const s = Object.assign({alias},this.state);

      mpt('db/pushMultipart',s).then(x=>{
        console.log(x);
        cancelEdit();
        reloadParent();
      }).catch(x=>{
        console.error(x);
      });
    }

  	render(){
      const {sys,cancelEdit} = this.props; 
      const s = this.state;
      const dataKeyDecisions = 'DECISIONS_' + sys;

      const textareaSt = {width: '100%'};

      return (<table>
        <tbody>
          <tr>
            <td>Категория</td>
            <td><EAutocomplete value={s.CATEGORY_ID} onChange={(v)=>this.setVal('CATEGORY_ID',v)} dataKey='CLAIM_CATEGORIES' /></td>

            <td>Решение</td>
            <td><EAutocomplete value={s.DECISION_ID} onChange={(v)=>this.setVal('DECISION_ID',v)} dataKey={dataKeyDecisions} /></td>

            <td><Button onClick={()=>this.ajax('FABULA_SEC_PUSH')}>Сохранить</Button></td>
          </tr>
          <tr>
            <td>Наименование</td>
            <td><EInput value={s.NAME} onChange={(v)=>this.setVal('NAME',v)}  /></td>

            <td colSpan='2'>Содержимое</td>
            <td><Button onClick={()=>this.ajax('FABULA_SEC_REMOVE')}>Удалить</Button></td>
          </tr>          
          <tr>
            <td colSpan='4'>
              <textarea value={s.CONTENT} onChange={(v)=>this.setVal('CONTENT',v.target.value)} style={textareaSt}  />
            </td>
            <td><Button onClick={cancelEdit}>Отмена</Button></td>
          </tr>
        </tbody>
      </table>);
    }  //
}

const state2props = (state) => {
  const sid = getSessionId(state);
  const sys = getSystem(state);
  return {sid,sys};
}

export default connect(state2props)(FabulaSecEditor);