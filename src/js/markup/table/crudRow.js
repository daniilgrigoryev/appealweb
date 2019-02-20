import * as _ from 'lodash'
import * as F from './fields.js'
import React from 'react'
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {Dialog,Button,Input,Select} from 'element-react'
import {EInput} from '../appeal/element2rform/finput.js'
import {EAutocomplete} from '../appeal/element2rform/fautocomplete.js'
import {ECheckbox} from '../appeal/element2rform/checkbox.js'
import {ESwitch} from '../appeal/element2rform/switch.js'
import {ESelect} from  '../appeal/element2rform/select.js'
import {EPicker} from '../appeal/element2rform/picker.js'
import {ERadio} from '../appeal/element2rform/radio.js'

export default class CrudRow extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            row: Object.assign({},props.row)
        }
    }

    renderFileInput(field,onChange,val){
        return <EInput onChange={onChange} value={val} type='file' />
    }

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

    updateProperty(field,newVal){
        const {row} = this.state;
        row[field.field] = newVal;
        this.setState({row});   
    }

    getChanger(fIndex){
        const updateProperty = this.updateProperty.bind(this);
        const {fields} = this.props;
        const {row} = this.state;
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
        } else if (F.isFile(field)){
            INP = this.renderFileInput(field,onChange,val);
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

    hasChanges(){
        const outerRow = this.props.row;
        const innerRow = this.state.row;
        for (let field in outerRow){
            if ((outerRow[field]||'')!=(innerRow[field]||'')){
                return true;
            }
        }
        return false;
    }

    render(){
        const {row} = this.state;
        const {fields,editor,removeCrud,hideRow,saveCrud,columns} = this.props; 
        const {id} = row;
        const filtered = fields.filter(x=>x.field!='id');
        const CONTENT = this.getColumns(filtered,+columns);
        const CHG = this.hasChanges();
        const NWR = !id;

        const save = ()=>saveCrud(row);

        return (
            <div>
                <table>
                    <tbody>{CONTENT}</tbody>
                </table>
                <table>
                    <tbody>
                        <tr>
                            <td><Button onClick={hideRow}>Отмена</Button></td>
                            {!CHG ? null : <td><Button onClick={save}>Сохранить</Button></td>}
                            { NWR ? null : <td><Button onClick={removeCrud}>Удалить</Button></td>}
                        </tr>
                    </tbody>
                </table>
                {editor}
            </div>
        );
    } //
}