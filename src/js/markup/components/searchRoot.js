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
    	Row = <EPicker className="w60"  {...{value}} onChange={(e)=>change(i,'value',e)} datepicker='+'/>;
    } else if (typ=='B'){
      Row = <ECheckbox {...{value}} onChange={(e)=>change(i,'value',e)} />
    } //
    
    return (
      <div className="item">
        <div className="form-item">
          <div className="flex-parent flex-parent--center-cross flex-parent--center-main mr12">
              <button onClick={()=>remove(i)}>
                <i className="el-icon-close color-red"></i>
              </button>
          </div>
          <div className="form-item__label" title={label}>{label}</div>
          <div className="form-item__controls">
            <div className="mx6 select-container">
              <select className="select bg-white"
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
              <div className='select-arrow'></div>
            </div>
            <div>
              {Row}
            </div>
          </div>
        </div>
      </div>);
} //

class SearchRoot extends React.Component {
  
  constructor(props){
  	super(props);
  
    this.scrollElement = null;
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
        this.setState({root},()=>{
          setTimeout(()=>(this.scrollElement.scrollTop=this.scrollElement.scrollHeight),50);
        });
   }
  
  render() {
  	const {change,remove,add} = this;
  	const {root} = this.state;
    const {fields} = this.props;
    
    let ADD = fields.map(x=><option key={x.label} value={x.label}>{x.label}</option>);
    ADD = [<option key='000' value='000'>Добавить поле</option>,...ADD]; //
    
    return (
      <React.Fragment>
        <div className="items-wrap h240 scroll-styled scroll-auto" ref={el => (this.scrollElement = el) }>
          {root.map((x,i)=><SearchRow {...x} {...{change,remove,i}} />)}
        </div>
        <div className="select-container wmax240 mt12">
          <select className="w-full select bg-white dg-select" value='000' onChange={(evt)=>add(evt.target.value)}>{ADD}</select>
          <div className='select-arrow'></div>
        </div> 
      </React.Fragment>
    );
  }
}

export {SearchRoot}