import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form/immutable'
import {EInput,FInput} from '../element2rform/finput.js'
import {ESelect,FSelect} from  '../element2rform/select.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {getAc} from '../../../services/acCacher.js'
import * as _ from 'lodash'
import mapping from '../appealContent/mapping.js'

const data2str=(data)=>(data ? data.toISOString() : '');
const stopPg = (cb,id)=>(evt)=>{
    evt.stopPropagation();
    cb(id);
    return false;
}

const OFRow = (props)=>{
  const {ind,field,value,onChange,onRemove,onInfo,onExpand,checkExpand} = props;
  const {id} = value;
  const expanded = checkExpand(id);
  const onRmv = stopPg(onRemove,ind);
  const onInf = stopPg(onInfo,id);
  
  const onXpd = ()=>onExpand(id);
  const P = value;
  const M = mapping.topicList;

  if (!expanded){
    const collapsed = (
          <tr key={id} onClick={onXpd}>
            <td>{ind+1}</td>
            <td>{props.getValue(P.category)}</td>
            <td>{P.post_n}</td>
            <td>{data2str(P.post_date)}</td>
            <td><button type='button' onClick={onInf}>i</button></td>
            <td><button type='button' onClick={onRmv}>x</button></td>
          </tr>);
    return [collapsed];
  } //

  const PRIS_UCH = (!P.UCH_PRIS) ? null : [
     <tr key='pu1' >
      <td>Дата рассмотрения</td>
      <td><Field component={FPicker} name={field+M.RASSMOTR_DATE.name} value={P[M.RASSMOTR_DATE.name]} datepicker='+' /></td>
    </tr>,
    <tr key='pu2' >
      <td>Время рассмотрения</td>
      <td><Field component={FPicker} name={field+M.RASSMOTR_TIME.name} value={P[M.RASSMOTR_TIME.name]} timepicker='+' /></td>
    </tr>];

  const editable = [
    <tr key={id+'e1'}>
            <td>{ind+1}</td>
            <td><Field component={FAutocomplete} name={field+'category'} placeholder='Категория' key='2344' value={P.category} /></td>
            <td><Field component={FInput}  name={field+'post_n'}    value={P.post_n}     /></td>
            <td><Field component={FPicker} name={field+'post_date'} value={P.post_date}  datepicker='+' /></td>
            <td><button type='button' onClick={onInf}>i</button></td>
            <td><button type='button' onClick={onRmv}>x</button></td>
    </tr>
    ,
    <tr key={id+'e2'}>
      <td colSpan='5'>
        <table>
          <tbody>
            <tr>
              <td>Связанные документы</td>
              <td>{P.docs}</td>
            </tr>
            <tr>
              <td>Необходимо присутствие участника</td>
              <td><Field component={FCheckbox} value={P[M.UCH_PRIS.name]} name={field+M.UCH_PRIS.name} /></td>
            </tr>
            {PRIS_UCH}

            <tr>
              <td>{M.CODEX_ARTICLE.label}</td>
              <td><Field component={FInput} value={P[M.CODEX_ARTICLE.name]} name={field+M.CODEX_ARTICLE.name} /></td>
            </tr>
            <tr>
              <td>{M.OWNER_TS.label}</td>
              <td><Field component={FInput} value={P[M.OWNER_TS.name]} name={field+M.OWNER_TS.name} /></td>
            </tr>
            <tr>
              <td>{M.OWNER_TS_ADR.label}</td>
              <td><Field component={FInput} value={P[M.OWNER_TS_ADR.name]} name={field+M.OWNER_TS_ADR.name} /></td>
            </tr>










 
          </tbody>
        </table>
      </td>
    </tr>];
    return editable;
} //


const getRow = (category,post_n,post_date,docs,cause,uch_pris,apn_adr,apn_date,description,owner,owner_adr,decision,decision_base,chief,decision_date,article,regno)=>{
  return {
    id: _.uniqueId('tcl'),
    category: category || '',
    post_n: post_n || '',
    post_date: post_date || null,
    docs: docs || 'Отсутствуют',
    cause: cause || '',
    uch_pris: !!uch_pris || false,
    apn_adr: apn_adr || '',
    apn_date: apn_date || null,
    description: description || '',
    owner: owner || '',
    owner_adr: owner_adr || '',
    decision: decision || null,
    decision_base: decision_base || null,
    chief: chief || null,
    decision_date: decision_date || null,
    article: article || '',
    regno: regno || '' 
  }
}

// Element component
class ETopicList extends React.Component {

  constructor(props) {
    super(props);
    const eid = _.chain(this.props.fileds).first().get('id').value();
    this.state = { 
      acCateg: null,
      expandedId : eid 
    };
  }

  getCategValue(property){
    const {acCateg} = this.state;
    return !_.size(acCateg)
      ? property
      : _.chain(acCateg).filter(x=>x.property==property).first().get('value').value();
  }

  componentDidMount(){
    getAc('key').then(data=>this.setState({acCateg:data}));
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

  onInfo(rowId){
      debugger;
  }


  onExpand(expandedId){
    this.setState({expandedId});
  }

  render() {
    const rmv  = this.onRemove.bind(this);
    const inf  = this.onInfo.bind(this);
    const xpd  = this.onExpand.bind(this);
    const getV = this.getCategValue.bind(this);

    const {fields} = this.props; 
    const ROWS = fields.map((x,i,arr)=>(<OFRow key={i} ind={i} checkExpand={(id)=>id===this.state.expandedId} field={x} value={arr.get(i)} onRemove={rmv} onInfo={inf} onExpand={xpd} getValue={getV}>{x.value}</OFRow>)); //
    const add = ()=>fields.push(getRow());

    return (
      <table>
        <thead>
          <tr>
            <th>№</th>
            <th>Категория</th>
            <th>№ постановления</th>
            <th>Дата</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><button type="button" onClick={add}>Добавить тему</button></td>
          </tr>
          {ROWS}
        </tbody>
      </table>
    )
  }//
}

const FTopicList = (props) => {
  const {input,meta} = props;
  return <ETopicList {...props} {...input} {...meta} reduxformfield="true" />
}  //
//


export {ETopicList,FTopicList};