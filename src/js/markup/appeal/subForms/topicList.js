import React from 'react'
import {EInput} from '../element2rform/finput.js'
import {EPicker,FPicker} from '../element2rform/picker.js'
import {ECheckbox,FCheckbox} from '../element2rform/checkbox.js'
import {EAutocomplete,FAutocomplete} from '../element2rform/fautocomplete.js'
import {getAc} from '../../../services/acCacher.js'
import * as _ from 'lodash'

const data2str=(data)=>(data ? data.toISOString() : '');

const prevDef = (callback, ctx, ...args)=>{
    evt.stopPropagation();
    callback.apply(cxt,args);
    return false;
}

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
            <td>{ind+1}</td>
            <td>{props.getValue(P.category)}</td>
            <td>{P.post_n}</td>
            <td>{data2str(P.post_date)}</td>
            <td><button onClick={onInf}>i</button></td>
            <td><button onClick={onRmv}>x</button></td>
          </tr>);
    return [collapsed];
  } //

  const editable = [
    <tr key={id+'e1'}>
            <td>{ind+1}</td>
            <td><EAutocomplete placeholder='Категория' key='2344' value={P.category} onChange={onChg('category')}/></td>
            <td><EInput  name='post_n'    value={P.post_n}    onChange={onChg('post_n')} /></td>
            <td><EPicker name='post_date' value={P.post_date} onChange={onChg('post_date')} datepicker='+' /></td>
            <td><button onClick={onInf}>i</button></td>
            <td><button onClick={onRmv}>x</button></td>
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
              <td>Причина жалобы на постановление по делу об АП (В случае отмены постановления указывается причина по которой постановление отменено)</td>
              <td><EAutocomplete placeholder='Причина жалобы' key='2344' value={P.cause} onChange={onChg('cause')} name='cause' /></td>
            </tr>
            <tr>
              <td>Необходимо присутствие участника</td>
              <td><ECheckbox value={P.uch_pris} onChange={onChg('uch_pris')} name='uch_pris' /></td>
            </tr>
            <tr>
              <td>Адрес АПН</td>
              <td><EInput  name='apn_adr'    value={P.apn_adr}    onChange={onChg('apn_adr')} type="textarea" /></td>                            
            </tr>
            <tr>
              <td>Дата АПН</td>
              <td><EPicker name='apn_date' value={P.apn_date} onChange={onChg('apn_date')} datepicker='+' /></td>
            </tr>
            <tr>
              <td>Описание</td>
              <td><EInput  name='description'    value={P.description}    onChange={onChg('description')} type="textarea" /></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>];
    return editable;
} //


const getRow = (category,post_n,post_date,docs,cause,uch_pris,apn_adr,apn_date,description)=>{
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
    description: description || ''
  }
}

// Element component
class ETopicList extends React.Component {

  constructor(props) {
    super(props);
    let {rows} = this.props;
    if (!rows || !rows.length){
      rows = [getRow()];
    }
    this.state = { 
      acCateg: null,
      rows: rows,
      expandedId : rows[0].id 
    };
  }

  getCategValue(property){
    const {acCateg} = this.state;
    return !_.size(acCateg)
      ? property
      : _.chain(acCateg).filter(x=>x.property==property).first().get('value').value();
  }


  componentDidMount(){
    getAc('key').then(data=>{
      this.setState({acCateg:data});
    });
  }

  onChange(id,field,newVal) {
    const P = this.props;
    const {reduxformfield,input} = P;
    const onChange = reduxformfield ? P.input.onChange : P.onChange;
    this.state.rows.filter(x=>x.id==id)[0][field] = newVal;
    const rows = this.state.rows;
    this.setState({rows},()=>{
      if (onChange){
        onChange(rows);
      }
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
        newRows = [getRow()];
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
      if (onChange){
        onChange(rows);
      }
    }); 
  }

  onInfo(rowId){


      debugger;
  }


  onExpand(expandedId){
    this.setState({expandedId})
  }

  render() {
    const chg  = this.onChange.bind(this);
    const rmv  = this.onRemove.bind(this);
    const inf  = this.onInfo.bind(this);
    const xpd  = this.onExpand.bind(this);
    const getV = this.getCategValue.bind(this);

    const ROWS = this.state.rows.map((x,i)=>(<OFRow key={x.id} ind={i} expanded={x.id===this.state.expandedId} {...x} onChange={chg} onRemove={rmv} onInfo={inf} onExpand={xpd} getValue={getV}  >{x.value}</OFRow>)); //
    const add = ()=>{
      const {rows} = this.state;
      rows.push(getRow());
      this.setState({rows})
    };

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