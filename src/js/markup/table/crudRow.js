import * as _ from 'lodash'
import React from 'react'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dialog,Button,Input,Select} from 'element-react'
import * as F from './fields.js'

import {EInput} from '../appeal/element2rform/finput.js'
import {EAutocomplete} from '../appeal/element2rform/fautocomplete.js'
import {ECheckbox} from '../appeal/element2rform/checkbox.js'
import {ESwitch} from '../appeal/element2rform/switch.js'
import {ESelect} from  '../appeal/element2rform/select.js'
import {EPicker} from '../appeal/element2rform/picker.js'
import {ERadio} from '../appeal/element2rform/radio.js'

export default class CrudRow extends React.Component {

    renderSelect(field,onChange,val){
        const {selectKey,selectData,selectGetter} = field;  
        return <ESelect onChange={onChange} value={val} dataKey={selectKey} data={selectData} datagetter={selectGetter} />;
    } //
    
    renderAutocomplete(field,onChange,val){
        const {acKey,acData} = field;
        return <EAutocomplete onChange={onChange} value={val} acKey={acKey} acData={acData} />;
    } //
        
    renderPicker(field,onChange,val){
        if (F.isTime(field)){
            return <EPicker onChange={onChange} value={val} timepicker='+' />
        } else if (F.isDate(field)) {
            return <EPicker onChange={onChange} value={val} datepicker='+' />
        } else if (F.isDateTime(field)) {
            return <EPicker onChange={onChange} value={val} datetimepicker='+' />
        }
    } //
        
    renderRadiobutton(field,onChange,val){
        const radioOptions = field.radio;
        return <ERadio value={val} onChange={onChange} options={radioOptions} />;
    } //
    
    renderCheckbox(field,onChange,val){ 
        return <ECheckbox onChange={onChange} value={val} />;
    } //
    
    renderString(field,onChange,val){
        return <EInput onChange={onChange} value={val} mask={field.mask} maskguide={field.maskguide} />;
    } //


    getChanger(fIndex){
        const {row,fields,updateProperty} = this.props;
        const field = fields[fIndex];
        const val = row[field.field];

        const onChange = (newVal)=>updateProperty(field,newVal);
        
        let INP = null;
        if (F.isSelect(field)){
            INP = this.renderSelect(field,onChange,val);
        } else if (F.isAutocomplete(field)){
            INP = this.renderAutocomplete(field,onChange,val);
        } else if (F.isPicker(field)){
            INP = this.renderPicker(field,onChange,val);
        } else if (F.isRadiobutton(field)){
            INP = this.renderRadiobutton(field,onChange,val);
        } else if (F.isCheckbox(field)){
            INP = this.renderCheckbox(field,onChange,val);
        } else if (F.isNumber(field)){
            INP = this.renderString(field,onChange,val);
        } else if (F.isString(field)){
            INP = this.renderString(field,onChange,val);
        }

        if (!INP){
            console.error('crudRow: no changer found',field);
        }

        return INP;
    }

    getColumns(fields,count){
        return _.chunk(fields,count).map((x,i)=>(
             <tr key={i}>
                {x.map((f,j)=>[
                    <td key={i+'L'+j}>{f.header||f.field}</td>,
                    <td key={i+'V'+j}>{this.getChanger(i*count+j)}</td>
                ])}
             </tr>)
        );//
    }

    render(){
        const {fields,removeRow,hideCrud,row} = this.props;
        const {id} = row;
        const filtered = fields.filter(x=>x.field!='id');
        const CONTENT = this.getColumns(filtered,1);
debugger;
        return (
            <div>
                <table>
                    <tbody>{CONTENT}</tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td><Button onClick={hideCrud}>К таблице</Button></td>
                            {id==null?null:<td><Button onClick={removeRow}>Удалить</Button></td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    } //


}