import React from 'react'
import {Button,Dropdown} from 'element-react'
import { Field, FieldArray, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {getAc} from '../../../services/acCacher.js'
import * as _ from 'lodash'
import FabulaDialog from '../fabulaDialog.js'

const data2str=(data)=>(data ? data.toISOString() : '');
const stopPg = (cb,id)=>(evt)=>{
    evt.stopPropagation();
    cb(id);
    return false;
}

const fTypes = [
  'Сопроводительное письмо',
  'Универсальный',
  'Определение',
  'Уведомление',
  'Вызов',
  'Инициативное письмо',
  'Перенаправление',
  'Извещение о явке'
]

const OFRow = (props)=>{
  const {ind,field,value,onRemove,onInfo,onExpand,checkExpand,onFabula,fabData} = props;
  const {id} = value;
  const expanded = checkExpand(id);
  const onRmv = stopPg(onRemove,ind);
  const onInf = stopPg(onInfo,id);
  const onXpd = ()=>onExpand(id);
  const onFab = (type)=>()=>onFabula(type,fabData);
  const commandFabula = (type,el)=>onFabula(type,fabData);

  const P = value;
  if (!expanded){
    const collapsed = (
          <tr key={id} onClick={onXpd}>
            <td>{P.doc_target}</td>
            <td>{P.ish_num}</td>
            <td>{data2str(P.ish_date)}</td>
            <td>{P.podpisal}</td>
            <td>{P.status}</td>
            <td><button onClick={onRmv}>x</button></td>
          </tr>);
    return [collapsed];
  } //

  const editable = [
    <tr key={id+'e1'}>
            <td><Field component={FInput}  name={field+'doc_target'}    value={P.doc_target}     /></td>
            <td><Field component={FInput}  name={field+'ish_num'}       value={P.ish_num}        /></td>
            <td><Field component={FPicker} name={field+'ish_date'}      value={P.ish_date}       datepicker='+' /></td>
            <td><Field component={FInput}  name={field+'podpisal'}      value={P.podpisal}       /></td>
            <td>{P.status}</td>
            <td><button type='button' onClick={onRmv}>x</button></td>
    </tr>
    ,
    <tr key={id+'e2'}>
      <td colSpan='6'>
        <h1>Детальная информация</h1>
        <table>
          <tbody>
            <tr>
              <td>Связанная тема</td>
              <td><Field component={FSelect}  name={field+'related_topic'}      value={P.related_topic}    dataKey='related_topic' /></td>
              <td>Подпись с ЭП</td>
              <td><Field component={FCheckbox}  name={field+'crypto_signature'} value={P.crypto_signature}    /></td>
            </tr>
            <tr>
              <td>Вид документа</td>
              <td><Field component={FSelect}  name={field+'doc_vid'}        value={P.doc_vid}     dataKey='doc_vid' /></td>
              <td>Способ доставки</td>
              <td><Field component={FSelect}  name={field+'delivery_type'}  value={P.delivery_type} dataKey='delivery_type' /></td>
            </tr>
            <tr>
              <td>Кол-во листов</td>
              <td><Field component={FInput}  name={field+'sheets_count'}       value={P.sheets_count}  /></td>
              <td>Номер в ЭДО</td>
              <td><Field component={FInput}  name={field+'edo_num'}  value={P.edo_num}    /></td>
            </tr>

            <tr>
              <td>Комментарий</td>
              <td><Field component={FInput}  name={field+'comment'}    value={P.comment}   type="textarea" /></td>                 
            </tr>                    
          </tbody>
        </table>

        <h1>Фабулы документов</h1>

        <Dropdown 
          onCommand={commandFabula}
          menu={(<Dropdown.Menu>
                  { fTypes.map(x=><Dropdown.Item command={x}>{x}</Dropdown.Item>) }
                 </Dropdown.Menu>)}>
          <Button type="primary">Создать файл<i className="el-icon-caret-bottom el-icon--right"></i></Button>
        </Dropdown>

        {null && <table>
          <tbody>
            <tr>
              <td>Тип:</td>
              <td>Сопроводительное письмо</td>
              <td><Button onClick={onFab('Сопроводительное письмо')}>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Универсальный</td>
              <td><Button onClick={onFab('Универсальный')}>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Определение</td>
              <td><Button onClick={onFab('Определение')}>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Уведомление</td>
              <td><Button onClick={onFab('Уведомление')}>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Вызов</td>
              <td><Button onClick={onFab('Вызов')}>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Инициативное письмо</td>
              <td><Button onClick={onFab('Инициативное письмо')}>Создать файл</Button></td> 
            </tr>
          </tbody>
        </table>}

        <h1>Сформированные документы</h1>
        <table>
          <tbody>
            <tr>
              <td>наименование документа</td>
              <td>x</td>
            </tr>
          </tbody>
        </table>

      </td>
    </tr>];
    return editable;
} //


const getRow = (doc_target,args = {})=>{
  const {ish_num,ish_date,podpisal,status,related_topic,crypto_signature,doc_vid,delivery_type,sheets_count,edo_num, comment,soprovod,universal,opred,uvedom,vyzov,initiation} = args;
  return {
    id: _.uniqueId('idl'),
    doc_target: doc_target,
    ish_num: ish_num || '',
    ish_date: ish_date || null,
    podpisal: podpisal || '',
    status: status || '',
    related_topic: related_topic || null,
    crypto_signature: crypto_signature || false,
    doc_vid: doc_vid || null,
    delivery_type: delivery_type || null,
    sheets_count: sheets_count || '',
    edo_num: edo_num || '',
    comment: comment || '',
    fabulas: {
      soprovod: soprovod || [],      
      universal: universal || [],
      opred: opred || [],
      uvedom: uvedom || [],
      vyzov: vyzov || [],      
      initiation: initiation || []
    },
    files:[] // {id,name}
  }
}

const getRowZajav = (args)=>getRow('zajav',args);
const getRowOrg   = (args)=>getRow('org'  ,args);

// Element component
class EIshDocList extends React.Component {

  constructor(props) {
    super(props);
    const eid = _.chain(this.props.fileds).first().get('id').value();
    this.state = {
      expandedId : eid,
      dialog: null
    };
  }

  dialogClose(){
    this.setState({dialog:null});
  }

  dialogOpenFabula(type,data){
    const cancel = this.dialogClose.bind(this);
    const done   = null;
    const title  = 'Исходящие документы';

    const props = Object.assign({},{cancel,done,title,type},data);
    const dialog = <FabulaDialog key='idlf' {...props} />; //// 

    this.setState({dialog});
  } //

  getValue(property){
    const {acCateg} = this.state;
    return !_.size(acCateg)
      ? property
      : _.chain(acCateg).filter(x=>x.property==property).first().get('value').value();
  }

  onRemove(index){ 
    const P = this.props;
    const {reduxformfield,input} = P;
    const {expandedId} = this.state;

    const rows = this.props.fields; 
    const rowId = rows.get(index).id;
    rows.remove(index);

    let newExpandedId = null;
    if (rowId == expandedId){
      if (rows.length==1){
        newExpandedId = rows[0].id;
      } else {
        newExpandedId = rows[Math.max(0,index-1)].id;
      }
    }
    this.setState({expandedId: newExpandedId}); 
  }

  onFileCreate(rowId,type){


      debugger;
  }


  onExpand(expandedId){
    this.setState({expandedId})
  }

  render() {
    const rmv  = this.onRemove.bind(this);
    const crf  = this.onFileCreate.bind(this);
    const xpd  = this.onExpand.bind(this);
    const fab  = this.dialogOpenFabula.bind(this);
    
    const {fields} = this.props;
    const fabData = {};
    debugger;
    const ROWS = fields.map((x,i,arr)=>(<OFRow key={i} ind={i} field={x} value={arr.get(i)} checkExpand={(id)=>id===this.state.expandedId} onRemove={rmv} onExpand={xpd} onFabula={fab} fabData={fabData} >{x.value}</OFRow>)); //
    
    const add = (rowGetter)=>()=>fields.push(rowGetter());
    const DIALOG = this.state.dialog;

    return (
      [<table key='idl1'>
        <thead>
          <tr>
            <th>Кому</th>
            <th>Исх.номер</th>
            <th>Исх.дата</th>
            <th>Подписал</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ROWS}
          <tr>
            <td><button type="button" onClick={add(getRowZajav)}>Добавить документ для заявителя</button></td>
            <td><button type="button" onClick={add(getRowOrg)}>Добавить документ для организации</button></td>
          </tr>
        </tbody>
      </table>, DIALOG]
    )
  }//
}

const FIshDocList = (props) => {
  const {input,meta} = props;
  return <EIshDocList {...props} {...input} {...meta} reduxformfield="true" />
}  //
//

export {EIshDocList,FIshDocList};