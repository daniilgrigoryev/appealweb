import React from 'react'
import {Button} from 'element-react'
import {EInput} from '../element2rform/finput.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {getAc} from '../../../services/acCacher.js'
import * as _ from 'lodash'

const data2str=(data)=>(data ? data.toISOString() : '');

const OFRow = (props)=>{
  const {ind,id,onChange,onRemove,onInfo,onExpand,expanded} = props;
  const onRmv = (evt)=>{
    evt.stopPropagation();
    onRemove(id);
    return false;
  };
  const onInf = (evt)=>{
    evt.stopPropagation();
    onInfo(id);
    return false;
  };
  const onChg = (field)=>(newVal)=>onChange(id,field,newVal);
  const onXpd = ()=>onExpand(id);
  const P = props;

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
            <td><EInput  name='doc_target'    value={P.doc_target}    onChange={onChg('doc_target')} /></td>
            <td><EInput  name='ish_num'       value={P.ish_num}       onChange={onChg('ish_num')} /></td>
            <td><EPicker name='ish_date'      value={P.ish_date}      onChange={onChg('ish_date')} datepicker='+' /></td>
            <td><EInput  name='podpisal'      value={P.podpisal}      onChange={onChg('podpisal')} /></td>
            <td>{P.status}</td>
            <td><button onClick={onRmv}>x</button></td>
    </tr>
    ,
    <tr key={id+'e2'}>
      <td colSpan='6'>
        <h1>Детальная информация</h1>
        <table>
          <tbody>
            <tr>
              <td>Связанная тема</td>
              <td><ESelect  name='related_topic'      value={P.related_topic}    onChange={onChg('related_topic')} dataKey='related_topic' /></td>
              <td>Подпись с ЭП</td>
              <td><ECheckbox  name='crypto_signature' value={P.crypto_signature}    onChange={onChg('crypto_signature')} /></td>
            </tr>
            <tr>
              <td>Вид документа</td>
              <td><ESelect  name='doc_type'       value={P.doc_type}    onChange={onChg('doc_type')} dataKey='doc_type' /></td>
              <td>Способ доставки</td>
              <td><ESelect  name='delivery_type'  value={P.delivery_type}    onChange={onChg('delivery_type')} dataKey='delivery_type' /></td>
            </tr>
            <tr>
              <td>Кол-во листов</td>
              <td><EInput  name='sheets_count'       value={P.sheets_count}    onChange={onChg('sheets_count')} /></td>
              <td>Номер в ЭДО</td>
              <td><EInput  name='edo_num'  value={P.edo_num}    onChange={onChg('edo_num')} /></td>
            </tr>

            <tr>
              <td>Комментарий</td>
              <td><EInput  name='comment'    value={P.comment}    onChange={onChg('comment')} type="textarea" /></td>                 
            </tr>                    
          </tbody>
        </table>

        <h1>Фабулы документов</h1>
        <table>
          <tbody>
            <tr>
              <td>Тип:</td>
              <td>Сопроводительное письмо</td>
              <td><Button>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Универсальный</td>
              <td><Button>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Определение</td>
              <td><Button>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Уведомление</td>
              <td><Button>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Вызов</td>
              <td><Button>Создать файл</Button></td> 
            </tr>
            <tr>
              <td>Тип:</td>
              <td>Инициативное письмо</td>
              <td><Button>Создать файл</Button></td> 
            </tr>
          </tbody>
        </table>


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
  const {ish_num,ish_date,podpisal,status,related_topic,crypto_signature,doc_type,delivery_type,sheets_count,edo_num, comment,soprovod,universal,opred,uvedom,vyzov,initiation} = args;
  return {
    id: _.uniqueId('idl'),
    doc_target: doc_target,
    ish_num: ish_num || '',
    ish_date: ish_date || null,
    podpisal: podpisal || '',
    status: status || '',
    related_topic: related_topic || null,
    crypto_signature: crypto_signature || false,
    doc_type: doc_type || null,
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
    let {rows} = this.props;
    if (!rows || !rows.length){
      rows = [getRowZajav()];
    }
    this.state = { 
      rows: rows,
      expandedId : rows[0].id 
    };
  }

  getValue(property){
    const {acCateg} = this.state;
    return !_.size(acCateg)
      ? property
      : _.chain(acCateg).filter(x=>x.property==property).first().get('value').value();
  }

  onChange(id,field,newVal) {
    const P = this.props;
    const {reduxformfield,input} = P;
    const onChange = reduxformfield ? P.input.onChange : P.onChange;
    this.state.rows.filter(x=>x.id==id)[0][field] = newVal;
    const rows = this.state.rows;
    this.setState({rows},()=>{
      (onChange) && (onChange(rows));
    });
  }

  onRemove(rowId){ 
    const P = this.props;
    const {reduxformfield,input} = P;
    const onChange = reduxformfield ? P.input.onChange : P.onChange;
    const {rows,expandedId} = this.state;

    let newRows = null;
    let newExpandedId = null;
    if (rowId == expandedId){
      const oldIndex = _.findIndex(this.state.rows,x=>x.id==this.state.expandedId);
      if (rows.length==1){
        newRows = [getRowZajav()];
        newExpandedId = newRows[0].id;
      } else {
        newRows = this.state.rows.filter(x=>x.id!=rowId);
        newExpandedId = newRows[Math.max(0,oldIndex-1)].id;
      }
    } else {
      newRows = this.state.rows.filter(x=>x.id!=rowId);
    }

    this.setState({
      rows: newRows,
      expandedId: newExpandedId
    },()=>{
      (onChange) && (onChange(rows));
    }); 
  }

  onFileCreate(rowId,type){


      debugger;
  }


  onExpand(expandedId){
    this.setState({expandedId})
  }

  render() {
    const chg  = this.onChange.bind(this);
    const rmv  = this.onRemove.bind(this);
    const crf  = this.onFileCreate.bind(this);
    const xpd  = this.onExpand.bind(this);
    
    const ROWS = this.state.rows.map((x,i)=>(<OFRow key={x.id} ind={i} expanded={x.id===this.state.expandedId} {...x} onChange={chg} onRemove={rmv} onExpand={xpd} >{x.value}</OFRow>)); //
    
    const add = (rowGetter)=>()=>{
      const {rows} = this.state;
      rows.push(rowGetter());
      this.setState({rows})
    };

    return (
      <table>
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
      </table>
    )
  }//
}

const FIshDocList = (props) => {
  const {input,meta} = props;
  return <EIshDocList {...props} {...input} {...meta} reduxformfield="true" />
}  //
//


export {EIshDocList,FIshDocList};