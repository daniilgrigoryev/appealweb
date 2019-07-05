import React, {Component} from 'react';
import {EInput} from './finput.js'
import {ESelect} from './select.js'
import {EPicker} from './picker.js'
import {ECheckbox} from './checkbox.js'
import {Button} from 'element-react'
import {Field, reduxForm} from 'redux-form/immutable'
import {messageSet} from '../../actions/common.js'
import positions from 'positions'

// import  '../../../scss/searchRoot.scss'
import  '../../../scss/index.scss';

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
      <div className="row">
        <div className="column">
          <div className="value">
            <EInput value={label} className="readOnly" readOnly/>
          </div>
        </div>
        <div className="column">
            <div className="value">
              <div className="select-container">
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
            </div>
        </div>
        <div className="column">
          <div className="value">
            {Row}
          </div>
        </div>
        <div className="column column--end">
            <div className="value mt0">
                  <Button className="py0" size="small" type="text" onClick={()=>remove(i)}>
                      <i className="ico round minus"/>
                  </Button>
                
                {/* {disabled ? null : 
                    <Button className="py0" size="small" type="text" onClick={add}>
                        <i className="ico round plus"/>
                    </Button>
                } */}
            </div>
        </div>
      </div>);
} //

class SearchRoot extends React.Component {
  
  constructor(props){
  	super(props);

    this.scrollElement = null;
  	this.state = {
      root :[], 
      defCondName : '',
      conditionName : '', 
      conditionsLables : [],
      showSavePort : false,
      showLoadPort : false
    };

    this.change = this.change.bind(this);
    this.remove = this.remove.bind(this);
 		this.add    = this.add.bind(this);
    
    this.saveCondition       = this.saveCondition.bind(this)
    this.loadCondition       = this.loadCondition.bind(this)
    this.setName             = this.setName.bind(this);
    this.retPort             = this.retPort.bind(this);
    this.changeSavePort      = this.changeSavePort.bind(this);
    this.changeLoadPort      = this.changeLoadPort.bind(this);
    this.setDefaultCondition = this.setDefaultCondition.bind(this);
    this.deleteCondition     = this.deleteCondition.bind(this);
    this.removeAll           = this.removeAll.bind(this);
   }

   componentDidMount(){
      const {setGetter, setRemover} = this.props;
      if (typeof setGetter == 'function'){
        setGetter(()=>(this.state.root));
      }

      if (typeof setRemover == 'function') {
        setRemover(this.removeAll);
      }
      const conditions = this.getConditions();
      const defaultConditionKey = this.getDefaultConditionKey();
      const defaultCondition = conditions[defaultConditionKey];
      this.setState ({
        conditionsLables :_.keys(conditions),
        root : defaultCondition ? defaultCondition : [],
        conditionName : defaultConditionKey,
        defCondName : defaultConditionKey
      });
   }

   change(key,field,evt){ 
        const {root} = this.state;
        root[key][field]=evt
        this.setState({root});
   }  

   remove(key){
      const root = this.state.root.filter((x,i)=>i!=key);
      let {showSavePort, showLoadPort, conditionName} = this.state; 
      if (_.isEmpty(root)) {
          showSavePort = false;
          showLoadPort = false;
          conditionName = '';
      }
      this.setState({showSavePort, showLoadPort, conditionName, root});
   }

   removeAll() {
    this.setState({
      showSavePort : false,
      showLoadPort : false,
      conditionName : '',
      root : []
    });
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

   getConditions() {
      try {
          const serializedState = localStorage.getItem('conditionMap');
          if (serializedState) {
            return JSON.parse(serializedState);
          }
      } catch (err) {    
      }
      return {};
    }

    getDefaultConditionKey() {
      try {
          const cKey = localStorage.getItem('defaultConditionKey');
          if (cKey) {
            return cKey;
          }
      } catch (err) {
      } 
      return '';
    }

    saveCondition() {
      if (this.hasErrors()) {
        return;
      }
      const {root, conditionName} = this.state;
      const conditions = this.getConditions();
      if (conditions[conditionName]){
        messageSet('Условие перезаписано', 'info');
      }      
      conditions[conditionName] = root;
      const serializedCond = JSON.stringify(conditions);
      
      localStorage.setItem('conditionMap', serializedCond);

      this.setState({
        showSavePort : false,
        conditionsLables : _.keys(conditions),
        conditionName : conditionName
      })
    }

    loadCondition(condName) {
      const conditionName = !condName ? '' : condName;
      let {root} = this.state 
      const conditions = this.getConditions();

      if (conditions && !_.isEmpty(conditions[conditionName])) {
          root = conditions[conditionName];
      }
      this.setState({conditionName, root});
    }

    deleteCondition() {
      const rlyDel = window.confirm('Вы уверены, что хотите удалить условие?');
      if (this.hasErrors() || !rlyDel) {
        return;
      }
      const {root, conditionName, defCondName} = this.state;
      const conditions = this.getConditions();
      let defCond = defCondName;

      if (conditionName == defCondName) {
        localStorage.removeItem('defaultConditionKey')
        defCond = '';
      }

      delete conditions[conditionName];
      const serializedCond = JSON.stringify(conditions);
      
      localStorage.setItem('conditionMap', serializedCond);

      this.setState({
        root : [],
        conditionsLables : _.keys(conditions),
        conditionName : '',
        defCondName : defCond
      });
    }

    hasErrors() {
      const {root, conditionName} = this.state;
      let msg = null;
      if (_.isEmpty((conditionName||'').trim())) {
          msg = 'Необходимо указать название';
      } else if (!root || _.isEmpty(root)) {
          msg = 'Необходимо указать условие'
      }
      if (!msg) {
        return false;
      }
      messageSet(msg, 'error');
      console.error(msg);
      return true;
    }

    setDefaultCondition() {
      const {conditionName, defCondName, conditionsLables} = this.state;
      if (this.hasErrors() || conditionName == defCondName) {
        return;
      }
      const conditions = _.without(conditionsLables, conditionName);
      conditions.unshift(conditionName);
      this.setState({defCondName : conditionName, conditionsLables : conditions});

      localStorage.setItem('defaultConditionKey', conditionName);
      messageSet('Установлено по умолчанию', 'info');
    }

    setName(conditionName) {
      this.setState({conditionName});
    }

    changeLoadPort() {
      this.setState({
        showLoadPort: !this.state.showLoadPort,
        showSavePort: false
      });
    }

    changeSavePort() {
      this.setState({
        showSavePort: !this.state.showSavePort,
        showLoadPort: false
      });
    }

    retPort() {
      const {loadCondition, changeLoadPort, saveCondition, changeSavePort, setDefaultCondition, deleteCondition, setName} = this;
      const {conditionName, conditionsLables, showLoadPort, showSavePort, defCondName} = this.state;
      const notDefaultCondition = !defCondName || conditionName != defCondName
  

      if (showLoadPort || showSavePort) {
        const INNER = showLoadPort  
          ?(<React.Fragment>
              <ESelect key={conditionName} value={conditionName} onChange={(v) => loadCondition(v)} data={conditionsLables}/>
              <Button className="mx6" size="small" type={notDefaultCondition ? "default" : "primary"} onClick={setDefaultCondition}>
                {notDefaultCondition ? "Установить по умолчанию" : "Установлено по умолчанию"}
              </Button> 

              <Button className="mx6" size="small" title="удалить условие" type="text" onClick={deleteCondition}>
                <i className="ico delete"></i>
              </Button>

          </React.Fragment>) 
          :(<React.Fragment>
              <EInput value={conditionName} onChange={(v)=>setName(v)} />
              <Button size="small" className="mx6" type="primary" onClick={saveCondition}>Сохранить</Button>
          </React.Fragment>); //

        return(
          <div className="flex-table pl0">
            <div className="row">
              <div className="column">
                <div className="label">
                  Сохраненные настройки поиска
                </div>
                <div className="value">
                  <div className="flex-parent flex-parent--center-cross">
                    {INNER}
                    <Button size="small" className="mx6" type="text" onClick={showLoadPort?changeLoadPort:changeSavePort}>отмена</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>);
      }
     return null;//
    }
  
    render() {
    	const {change, remove, add, changeSavePort, changeLoadPort} = this;
    	const {root} = this.state;
      const {fields} = this.props;
      
      const showSaveBtn = root && !_.isEmpty(root);

      let ADD = fields.map(x=><option key={x.label} value={x.label}>{x.label}</option>);
      ADD = [<option key='000' value='000'>Добавить поле</option>,...ADD]; //

      const showPort = this.retPort();

      return (
        <React.Fragment>

          <div className="searchRoot">
            <div className="panel">

              <div>
                <div className="searchRoot-item searchRoot__add">
                  <div className="wrap">
                    <div className="item item--full">
                        <small className="label">Добавить поле для поиска</small>
                        <div className="value">
                          <div className="select-container bg-white">
                            <select className="select" value='000' onChange={(evt)=>add(evt.target.value)}>{ADD}</select>
                            <div className='select-arrow'></div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
                <div className="searchRoot-item searchRoot__control">
                  <div className="flex-table pl0" ref={el => (this.scrollElement = el) }>
                    {root.map((x,i)=><SearchRow {...x} {...{change,remove,i}} />)}
                  </div>
                </div>
              </div>



              <div className="searchRoot-item searchRoot__saver">
                <div className="flex-parent flex-parent--center-cross flex-parent--end-main">
                  <Button size="small" onClick={changeLoadPort}>Загрузить условие</Button>
                  {showSaveBtn && <Button size="small" onClick={changeSavePort}>Сохранить условие</Button>}
                </div>


                {/* <Button size="small" onClick={changeSavePort}>Сохранить условие</Button> */}
                {showPort}
              </div>
            </div>
          </div>






        </React.Fragment>
      );//
    }
}

export {SearchRoot}