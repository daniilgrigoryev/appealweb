import * as _ from 'lodash'
import React from 'react'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dialog,Button,Input,Select} from 'element-react'
import CrudRow from './crudRow.js'

const C = {
    DATE: (field)=>(rowData, column)=>{
        const d = rowData[column.field];
        return d ? d.toString() : '';
    },
    BOOL: (field)=>(rowData, column)=>{
        return rowData[column.field] ? '+' : '';
    },
    RADIO:(field)=>(rowData, column)=>{
        const d = rowData[column.field];
        return _.chain(field.radio)
                .filter(x=>x.property==d)
                .map(x=>x.value)
                .first()
                .value();
    }
}

const T = {
    D : C.DATE,
    T : C.DATE,
    DT: C.DATE,
    C:  C.BOOL,
    SR: C.RADIO,
    NR: C.RADIO
}

const callIfExists = (func, ...args)=>{
    return !func ? null : func.apply(null,Array.from(args));
}

export default class CrudTable extends React.Component {

    constructor(props) {
        super(props);

        let {rows,fields} = props;
        if (!_.size(fields)){
            throw 'CrudTable: no data found'
        }
        rows = rows || [];

        this.state = {rows};
      
        this.save   = this.save.bind(this);
        this.delete = this.delete.bind(this);
        this.select = this.select.bind(this);
        this.add    = this.add.bind(this);
    }

    save() {
        let rows = [...this.state.rows];
        if(this.newrow){
            rows.push(this.state.row);
        } else {
            rows[this.findSelectedIndex()] = this.state.row;
        }

        this.setState({rows:rows, selectedRow:null, row: null, displayCrud:false});
    }

    delete() {
        let index = this.findSelectedIndex();
        this.setState({
            rows: this.state.rows.filter((val,i) => i !== index),
            selectedRow: null,
            row: null,
            displayCrud: false
        });
    }

    findSelectedIndex() {
        const {rows,selectedRow} = this.state;
        return rows.indexOf(selectedRow);
    }

    updateProperty(field, value) {
        let row = this.state.row;
        row[field.field] = value;
        this.setState({row});
    }

    select(e){
        this.newrow = false;
        this.setState({
            displayCrud:true,
            row: Object.assign({}, e.data)
        });
    }

    add(){
        const {fields} = this.props;
        const newRow = {};

        fields.forEach(x=>{
            let newVal = (x.type=='s') ? '' : null;
            newRow[x.field] = newVal;
        });

        this.newrow = true;
        this.setState({
            row: Object.assign({id:null},newRow),
            displayCrud: true
        });
    }

    hideCrud(){
        this.save();
        this.setState({displayCrud: false});
    }

	render(){
        const {displayCrud,selectedRow,row} = this.state;
        const {fields} = this.props;
        const noHidden = fields.filter(x=>!x.hidden);

        const removeRow = this.delete.bind(this);
        const hideCrud = this.hideCrud.bind(this);
        const updateProperty = this.updateProperty.bind(this);

	    let header = (<div className="p-clearfix" style={{width:'100%'}}><Button onClick={this.add}> Добавить</Button>
        </div>); //

        const CONTENT = displayCrud 
            ? <CrudRow fields={fields} row={row} updateProperty={updateProperty} hideCrud={hideCrud} removeRow={removeRow} /> 
            : <DataTable value={this.state.rows}  
                       onRowSelect={this.select} header={header}
                       selectionMode="single"    selection={selectedRow} 
                       onSelectionChange={e => this.setState({selectedRow: e.value})}  >
                {noHidden.map((f,i)=>(<Column key={i} field={f.field} header={f.header} sortable={!!f.sortable} body={callIfExists(T[f.type],f)} />))}             
              </DataTable>;

	    return (<div>{CONTENT}</div>); //
	}
}