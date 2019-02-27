import React from 'react'
import { Field,FieldArray, reduxForm,arrayPush } from 'redux-form/immutable'
import { Dialog,Button } from 'element-react'
import * as _ from 'lodash'

import DocLinker from './docLinker.js'
import {FInput, EInput}  from '../../../components/finput.js'
import {ESelect,FSelect} from  '../../../components/select.js'
import {EPicker,FPicker} from '../../../components/picker.js'

const getRow = (npost,desc,docId)=>{
  return {
    id: _.uniqueId('ldocs'),
    desc: desc || '',
    docId: docId || null 
  }
}

const linkedDocs = (props)=>{
    const {fields,disabled,hideLinker,showLinker} = props
    //const add = ()=>fields.push(getRow());
    const add = showLinker;

    const rmv = (ind)=>()=>fields.remove(ind);
    const inf = (ind)=>()=>fields.remove(ind); // ! replace me
    const ROWS = fields.map((x,i)=>(
          <tr key={i} >
            <td><Field disabled={disabled} component={FInput} name={x+'dodId'} value={x.dodId} disabled={true} /></td>
            <td><Field disabled={disabled} component={FInput} name={x+'desc'}  value={x.desc}  disabled={true} /></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
          </tr>)); //

    return (<table>
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>Описание</td>
                  <td colSpan='2'>{disabled ? null : <button type='button' onClick={add}>Связать</button>}</td>
                </tr>
                {ROWS}
              </tbody>
            </table>);
} //

class IncLinkInner extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      linkerVisible : false
    }

    this.showLinker = this.showLinker.bind(this);
    this.hideLinker = this.hideLinker.bind(this);
  }

  showLinker(){
    this.setState({linkerVisible:true});
  }

  hideLinker(){
    this.setState({linkerVisible:false});
  }

  render() {  
    const {disabled,array,dispatch} = this.props
    const {linkerVisible} = this.state;

    const dialogLink = (args)=>{
      _.each(args,(a)=>dispatch(arrayPush('outgoing', 'linkedDocs', getRow(a.DATE_CONTROL,a.THEME,_.uniqueId('asd')))));
      this.hideLinker();
    }

    const LINKER = !linkerVisible  
      ? null 
      : ( <Dialog key='ilid'
              title="Связанные документы"
              size="tiny" 
              showClose={false}
              closeOnClickModal={false}
              closeOnPressEscape={false}
              visible={ linkerVisible }
              onCancel={ this.hideLinker }
              lockScroll={ true }
            >
              <Dialog.Body>
                <DocLinker dialogLink={dialogLink} dialogClose={this.hideLinker} />
              </Dialog.Body>
          </Dialog>); //

    return [
      <div style={{background:'#d4fbfc'}} key='ili'>
        <h2>Связанные документы</h2>
        <FieldArray name='linkedDocs' component={linkedDocs} disabled={disabled} showLinker={this.showLinker} hideLinker={this.hideLinker} />
      </div>,
      LINKER
    ]
  }//
}

export default reduxForm({
  form: 'letter_incoming', // <------ same form name
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
  //validate
})(IncLinkInner)