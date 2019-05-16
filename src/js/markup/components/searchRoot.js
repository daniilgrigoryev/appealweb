import React, {Component} from 'react';
import {EInput} from './finput.js'
import {ESelect} from './select.js'
import {EPicker} from './picker.js'
import {ECheckbox} from './checkbox.js'

const SearchRow = (props)=>{
		const {im,change,remove,label,typ,dict,root,link,oper,i}  = props;
    let {value} = props;
      
    const nullable =(oper=='NULL' || oper=='NOT NULL');  
    let Row = <EInput {...{value}} onChange={(e)=>change(i,'value',e)} />;
    if (nullable){
    	Row = <span />;
    } else if (!!dict){
      Row= <ESelect {...{value}} onChange={(e)=>change(i,'value',e)} dataKey={dict} />;
    } else if (typ=='N'){
    	Row = <EInput {...{value}} onChange={(e)=>change(i,'value',e)} type="number" />;
    } else if (typ=='D'){
    	Row = <EPicker {...{value}} onChange={(e)=>change(i,'value',e)} datepicker='+'/>;
    } else if (typ=='B'){
      Row = <ECheckbox {...{value}} onChange={(e)=>change(i,'value',e)} />
    } //
    
    return (
    	<tr>
        <td>
          <span>{label}</span>
        </td>
        <td>
          <select style={{marginLeft: '4px', marginRight: '8px'}}
              value={oper} 
              onChange={(evt)=>change(i,'oper',evt.target.value)}>
              <option value="=">=</option>
              <option value=">=">&gt;=</option>
              <option value=">">&gt;</option>
              <option value="<=">&lt;=</option>
              <option value="<">&lt;</option>
              <option value="<>">&lt;&gt;</option>
              <option value="NULL">NULL</option>
              <option value="NOT NULL">NOT NULL</option>
              <option value="LIKE">Контекст</option>
           </select>
         </td>
         <td>
          {Row}
         </td>
         <td>
            <button onClick={()=>remove(i)} style={{marginLeft: '8px'}}  >X</button>
         </td>
      </tr>);
} //

class SearchRoot extends React.Component {
  
  constructor(props){
  	super(props);
  
  	this.state = {root :[]}
    
    this.change = this.change.bind(this);
    this.remove = this.remove.bind(this);
 		this.add    = this.add.bind(this);
   }

   componentDidMount(){
      const {setGetter} = this.props;
      if (typeof setGetter == 'function'){
        setGetter(()=>(this.state.root));
      }
   }

   change(key,field,evt){ 
        const {root} = this.state;
        root[key][field]=evt
        this.setState({root});
   }  

   remove(key){
        const root = this.state.root.filter((x,i)=>i!=key);
        this.setState({root});
   }

   add(fieldLabel){
        const {fields} = this.props;
        let {root} = this.state;
        const field = fields.filter(x=>x.label==fieldLabel)[0];
        const row = Object.assign({oper:'=',value:''},field);
        root = [...root,row];
        this.setState({root});			
   }
  
  render() {
  	const {change,remove,add} = this;
  	const {root} = this.state;
    const {fields} = this.props;
    
    let ADD = fields.map(x=><option key={x.label} value={x.label}>{x.label}</option>);
    ADD = [<option key='000' value='000'>Добавить поле</option>,...ADD]; //
    
    return (
      <table>
        <tbody>
        {root.map((x,i)=><SearchRow {...x} {...{change,remove,i}} />)}
        
        <tr>
          <td colSpan='4'>
            <select value='000' onChange={(evt)=>add(evt.target.value)}>
              {ADD}
            </select>
          </td>
        </tr>
        </tbody>       
      </table>
    ); //
  }
}

export {SearchRoot}