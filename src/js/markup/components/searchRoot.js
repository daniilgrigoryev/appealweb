import {EInput} from './finput.js'
import {ESelect} from './select.js'
import {EPicker} from './picker.js'

const SearchRow = (props)=>{
		const {im,change,remove,label,typ,root,link,oper,i}  = props;
    let {value} = props;
      
    const nullable =(oper=='NULL' || oper=='NOT_NULL');  
    let Row = <EInput {...{value}} onChange={(e)=>change(i,'value',e)} />;
    if (nullable){
    	Row = <span />;
    } else if (typ=='N'){
    	Row = <EInput {...{value}} onChange={(e)=>change(i,'value',e)} type="number" />;
    } else if (typ=='D'){
    	Row = <EPicker {...{value}} onChange={(e)=>change(i,'value',e)} datepicker='+'/>;
    } else if (){
      
    }
    
    return (
    	<div style={{display:'flex',marginLeft: '30px', flexWrap: 'wrap'}}>
        <button onClick={()=>remove(i)}>Удалить</button>
        <span>{label}</span>
        <select 
            value={oper} 
            onChange={(evt)=>change(i,'oper',evt)}>
            <option value="=">=</option>
            <option value=">=">&gt;=</option>
            <option value=">">&gt;</option>
            <option value="<=">&lt;=</option>
            <option value="<">&lt;</option>
            <option value="<>">&lt;&gt;</option>
            <option value="NULL">NULL</option>
            <option value="NOT_NULL">NOT NULL</option>
         </select>
         {Row}
      </div>);
}

class SearchRoot extends React.Component {
  
  constructor(props){
  	super(props);
  
  	this.state = {root :[]}
    
    this.change = this.change.bind(this);
    this.remove = this.remove.bind(this);
 		this.add    = this.add.bind(this);
   }

   change(key,field,evt){ 
        const {root} = this.state;
        root[key][field]=evt.target.value
        this.setState({root});
   }  

   remove(key){
        const root = this.state.root.filter((x,i)=>i!=key);
        this.setState({root});
   }

   add(fieldLabel){
        let {root} = this.state;
        const field = fields.filter(x=>x.label==fieldLabel)[0];
        const row = Object.assign({oper:'=',value:''},field);
        root = [...root,row];
        this.setState({root});			
   }
  
  render() {
  	const {change,remove,add} = this;
  	const {root} = this.state;
    const {fields,getCondition} = this.props;
    
    let ADD = fields.map(x=><option key={x.label} value={x.label}>{x.label}</option>);
    ADD = [<option key='000' value='000'>Добавить поле</option>,...ADD]; //
    return (
      <div>
        <button onClick={()=>getCondition(root)} >getQuery</button>
        {root.map((x,i)=><SearchRow {...x} {...{change,remove,i}} />)}
        <select 
              value='000' 
              onChange={(evt)=>add(evt.target.value)}>
              {ADD}
        </select>       
      </div>
    ); //
  }
}

export {SearchRoot}