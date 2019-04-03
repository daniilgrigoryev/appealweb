import * as _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import {Button} from 'element-react'
import {EAutocomplete} from '../components/fautocomplete.js'
import {EInput} from '../components/finput.js'
import {getSessionId,getSystem} from '../../selectors/common.js'
import {mpt,get} from '../../services/ajax.js'
import {baseUrl} from '../../services/api.js'

class FabulaDocEditor extends React.Component {
  
    constructor(props){
      super(props);
      this.state = Object.assign({system: props.sys},props.fabDoc);

      this.ajax     = this.ajax.bind(this);
      this.loadFile = this.loadFile.bind(this);
    }

    setVal(field,value){
      this.setState({[field]:value})
    }

    ajax(alias){
      const {reloadParent} = this.props;
      const s = Object.assign({alias},this.state);

      mpt('db/pushMultipart',s).then(x=>{
        console.log(x);
        reloadParent();
      }).catch(x=>{
        console.error(x);
      });
    }

    loadFile(id){
        const {sid}  = this.props;
        const {NAME} = this.state;
        const params = new URLSearchParams();
        params.append('sessionId',sid);
        params.append('ID',id);

        const link     = baseUrl() + 'doc/get_fabula_docx?'+params.toString();
        const filename = encodeURI(NAME+'.docx');

        const tempLink = document.createElement('a');
        tempLink.href  = link;
        tempLink.setAttribute('download', filename);
        tempLink.click();

        setTimeout(()=>{
          tempLink && (tempLink.remove());
        },5000);
    }

  	render(){
      const {sys} = this.props; 
      const s = this.state;

      const dataKeyTipDoc = 'FAB_DOC_TYPES_' + sys;

      return (<table>
        <tbody>
          <tr>
            <td>Тип документа</td>
            <td><EAutocomplete value={s.DOC_TYPE_ID} onChange={(v)=>this.setVal('DOC_TYPE_ID',v)} dataKey={dataKeyTipDoc} /></td>

            <td>Тип заявителя</td>
            <td><EAutocomplete value={s.PERSON_TYPE_ID} onChange={(v)=>this.setVal('PERSON_TYPE_ID',v)} dataKey='PERSON_TYPE' /></td>

            <td><Button onClick={()=>this.ajax('FABULA_DOC_PUSH')}>Сохранить</Button></td>
          </tr>
          <tr>
            <td>Наименование</td>
            <td><EInput value={s.NAME} onChange={(v)=>this.setVal('NAME',v)}  /></td>

            <td>Файл</td>
            <td><input type="file" onChange={(v)=>{
                const F = v.target.files[0];
                this.setVal('NAME',F.name.replace('.docx',''));
                this.setVal('file',F); 
              }} /></td>          
            <td><Button onClick={()=>this.ajax('FABULA_DOC_REMOVE')}>Удалить</Button></td>
          </tr>
          <tr>
            <td colSpan="4"></td>            
            <td><Button onClick={()=>this.loadFile(s.ID)}>Получить docx</Button></td>
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

export default connect(state2props)(FabulaDocEditor);