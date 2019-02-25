import React from 'react'
import {Field, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {ERadio, FRadio} from '../../components/radio.js'
import {DataTable} from 'primereact/datatable'
import {Column} from 'primereact/column';



import * as V from '../../../validators'
import {Button, Input} from 'element-react'


const header = 'Ejs 2 reduxF test';

const TestElement2RF = props => {
    const {handleSubmit, pristine, nextPage, prevPage, submitting, disabled} = props;

    const fields = [
        {
            name: 'RESPONSE_TY6PE',
            label: 'Способ направления ответа',
            comment: 'Это комментарий поля 1'
        }, {
            name: 'SHEETS_COUNT21',
            label: 'Количество листов',
            comment: 'Это комментарий поля 2'
        }
    ].map(x => (x.type = x.type || 'text', x));


    const InputsMap = fields.map((f) => <tr key={f.name}>
        <td className='ap-input-caption'>{f.label}</td>
        <td>
            <Field disabled={disabled} name={f.name} component={FInput} className='zzz22' validate={[V.required]}/>
            <p className="ap-input-comment">{f.comment}</p>
        </td>
    </tr>) //
    const phoneMask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

    const radioOptions = [
        {
            property: 111,
            value: '111'
        }, {
            property: 222,
            value: '222'
        }, {
            property: 333,
            value: '333'
        }
    ];

    const tableData = [
            {"brand": "VW", "year": 2012, "color": "Orange", "vin": "dsad231ff"},
            {"brand": "Audi", "year": 2011, "color": "Black", "vin": "gwregre345"},
            {"brand": "Renault", "year": 2005, "color": "Gray", "vin": "h354htr"},
            {"brand": "BMW", "year": 2003, "color": "Blue", "vin": "j6w54qgh"},
            {"brand": "Mercedes", "year": 1995, "color": "Orange", "vin": "hrtwy34"},
            {"brand": "Volvo", "year": 2005, "color": "Black", "vin": "jejtyj"},
            {"brand": "Honda", "year": 2012, "color": "Yellow", "vin": "g43gr"},
            {"brand": "Jaguar", "year": 2013, "color": "Orange", "vin": "greg34"},
            {"brand": "Ford", "year": 2000, "color": "Black", "vin": "h54hw5"},
            {"brand": "Fiat", "year": 2013, "color": "Red", "vin": "245t2s"}
        ];

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1 className='ap-h1'>Заголовки</h1>
                <h1 className='ap-h2'>Header 2</h1>
                <h1 className='ap-h3'>Header 3</h1>
                <h1 className='ap-h4'>Header 4</h1>
            </div>

            <div>
                <h1 className='ap-h1'>Кнопки</h1>
                <Button>Default</Button>
                <Button type="text" className='ap-btn-cancel'>Cancel</Button>
                <Button type="text" className='ap-btn-underlined'>Underlined</Button>
                <Button type="text" className='ap-btn-link'>Link</Button>
            </div>


            <h2 className='ap-h2'>Инпуты</h2>
            <table>
                <tbody>
                {InputsMap}
                <tr>
                    <td className='ap-input-caption'>
                        <span>Textarea</span>
                    </td>
                    <td>
                        <Input
                            type="textarea"
                            autosize={{minRows: 2, maxRows: 4}}
                            placeholder="Please input"
                        />
                    </td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>Autocomplete</td>
                    <td>
                        <Field disabled={disabled} name='autocompl' placeholder='123' key='2344' className='w-full'
                               component={FAutocomplete} validate={[V.required]}/>
                    </td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>телефон с маской</td>
                    <td><Field disabled={disabled} component={FInput} placeholder='123' key='phone' className='phone22'
                               name='phonemask' mask={phoneMask} validate={[V.required]}/></td>
                </tr>
                <tr>
                    <td colSpan='2'><h2 className='ap-h2'>Checkbox/Radio</h2></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>чекбокс</td>
                    <td><Field disabled={disabled} component={FCheckbox} name='checkbox' key='chch'/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>чекбокс отмеченный</td>
                    <td><Field disabled={disabled} component={FCheckbox} name='checkbox' key='chch' checked/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>свитч</td>
                    <td><Field disabled={disabled} component={FSwitch} name='switch'/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>радио</td>
                    <td className='pr12'><Field disabled={disabled} component={FRadio} name='radio'
                                                options={radioOptions}/></td>
                    <td><ERadio options={radioOptions}/></td>
                </tr>
                <tr>
                    <td colSpan='2'><h2 className='ap-h2'>Dropdown</h2></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>Select</td>
                    <td><Field disabled={disabled} component={FSelect} name='select' dataKey='123'
                               placeholder='Select'/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>Select Underlined</td>
                    <td><Field disabled={disabled} component={FSelect} name='select' dataKey='123' placeholder='Select'
                               className='ap-select-underlined'/></td>
                </tr>
                <tr>
                    <td colSpan='2'><h2 className='ap-h2'>Datepicker</h2></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>время</td>
                    <td><Field disabled={disabled} component={FPicker} name='timepicker' timepicker='+'
                               placeholder='timepicker' validate={[V.required]}/></td>
                    <td><EPicker timepicker='+'/></td>
                </tr>

                <tr>
                    <td className='ap-input-caption'>дата</td>
                    <td className='pr12'><Field disabled={disabled} component={FPicker} name='datepicker' datepicker='+'
                                                placeholder='datepicker' validate={[V.required]}/></td>
                    <td><EPicker datepicker='+'/></td>
                </tr>
                <tr>
                    <td className='ap-input-caption'>датавремя</td>
                    <td className='pr12'><Field disabled={disabled} component={FPicker} name='datetimepicker'
                                                datetimepicker='+'
                                                placeholder='datetimepicker' validate={[V.required]}/></td>
                    <td><EPicker datetimepicker='+'/></td>
                </tr>

                </tbody>
            </table>

            <DataTable value={tableData}>
                <Column field="vin" header="Vin" />
                <Column field="year" header="Year" />
                <Column field="brand" header="Brand" />
                <Column field="color" header="Color" />
            </DataTable>
        </form>
    )
}

export default reduxForm({
    form: 'appeal', // <------ same form name                       disabled={pristine || submitting}
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(TestElement2RF)