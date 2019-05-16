import React, {Component} from 'react';
import {EInput} from './finput.js'
import {ESelect} from './select.js'
import {EPicker} from './picker.js'
import {ECheckbox} from './checkbox.js'

const SearchRow = (props)=>{
		const {im,change,remove,label,typ,dict,root,link,oper,i}  = props;
    let {value} = props;
      
    const nullable =(oper=='NULL' || oper=='NOT_NULL');  
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
      <div className="item">
        <div className="grid">
          <div className="col col--4">
            <span>{label}</span>
          </div>
          <div className="col col--2">
            <select
                value={oper} 
                onChange={(evt)=>change(i,'oper',evt.target.value)}>
                <option value="=">=</option>
                <option value=">=">&gt;=</option>
                <option value=">">&gt;</option>
                <option value="<=">&lt;=</option>
                <option value="<">&lt;</option>
                <option value="<>">&lt;&gt;</option>
                <option value="NULL">NULL</option>
                <option value="NOT_NULL">NOT NULL</option>
                <option value="LIKE">Контекст</option>
            </select>
          </div>
          <div className="col">
            {Row}
          </div>
          <div className="col col--1">
            <div className="flex-parent flex-parent--center-cross flex-parent--center-main">
              <button onClick={()=>remove(i)}>
                <i className="el-icon-delete color-red"></i>
              </button>
            </div>
          </div>
        </div>
      </div>);
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
      <div>
        <div className="items-wrap h240 scroll-styled scroll-auto border--1">
          {root.map((x,i)=><SearchRow {...x} {...{change,remove,i}} />)}
        </div>
        <div className="wmax240 my12">
          <select className="w-full" value='000' onChange={(evt)=>add(evt.target.value)}>{ADD}</select>
        </div>
      </div>









    ); //
  }
}

export {SearchRoot}