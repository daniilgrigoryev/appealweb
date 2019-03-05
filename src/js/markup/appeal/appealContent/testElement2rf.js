import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
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

import {appealLoad} from '../../../actions/common.js'
import * as V from '../../../validators'
import {Button, Input, Card, Layout} from 'element-react'


const header = 'Ejs 2 reduxF test';

const TestElement2RF = props => {
    const {handleSubmit, pristine, nextPage, prevPage, submitting, disabled} = props;

    const load = ()=>{
        props.dispatch(appealLoad(testAppeal));
    }

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
            <Layout.Row gutter="12" className='my18 mx18'>
                <Layout.Col span="6">
                    <Card className="box-card" header={<h3 className='ap-h3'>Заголовки</h3>}>
                        <h1 className='ap-h1'>Header 1</h1>
                        <h2 className='ap-h2'>Header 2</h2>
                        <h3 className='ap-h3'>Header 3</h3>
                        <h4 className='ap-h4'>Header 4</h4>
                    </Card>
                </Layout.Col>
                <Layout.Col span="6">
                    <Card className="box-card" header={<h3 className='ap-h3'>Кнопки</h3>}>
                        <p>
                            <Button>Default</Button>
                        </p>
                        <p>
                            <Button type="text" className='ap-btn-cancel'>Cancel</Button>
                        </p>
                        <p>
                            <Button type="text" className='ap-btn-underlined'>Underlined</Button>
                        </p>
                        <p>
                            <Button type="text" className='ap-btn-link'>Link</Button>
                        </p>
                    </Card>
                </Layout.Col>
            </Layout.Row>

            <Layout.Row gutter="12" className='my18 mx18'>
                <Layout.Col span="6">
                    <Card className="box-card" header={<h3 className='ap-h3'>Инпуты</h3>}>
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
                                   <Field disabled={disabled} name='autocompl' placeholder='123' key='2344'
                                          className='w-full'
                                          component={FAutocomplete} validate={[V.required]}/>
                               </td>
                           </tr>
                           <tr>
                               <td className='ap-input-caption'>телефон с маской</td>
                               <td><Field disabled={disabled} component={FInput} placeholder='123' key='phone'
                                          className='phone22'
                                          name='phonemask' mask={phoneMask} validate={[V.required]}/></td>
                           </tr>
                           </tbody>
                        </table>
                    </Card>
                </Layout.Col>
                <Layout.Col span="6">
                    <Card className="box-card" header={<h3 className='ap-h3'>Checkbox/Radio</h3>}>
                        <table>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption'>чекбокс</td>
                                <td><Field disabled={disabled} component={FCheckbox} name='checkbox' key='chch'/></td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption'>чекбокс отмеченный</td>
                                <td><Field disabled={disabled} component={FCheckbox} name='checkbox' key='chch'
                                           checked/></td>
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
                            </tbody>
                        </table>
                    </Card>
                </Layout.Col>
            </Layout.Row>

            <Layout.Row gutter="12" className='my18 mx18'>
                <Layout.Col span="6">
                    <Card className="box-card" header={<h3 className='ap-h3'>Datepicker</h3>}>
                        <table>
                            <tbody>
                            <tr>
                                <td className='ap-input-caption'>время</td>
                                <td><Field disabled={disabled} component={FPicker} name='timepicker' timepicker='+'
                                           placeholder='timepicker' validate={[V.required]}/></td>
                                <td><EPicker timepicker='+'/></td>
                            </tr>

                            <tr>
                                <td className='ap-input-caption'>дата</td>
                                <td className='pr12'><Field disabled={disabled} component={FPicker} name='datepicker'
                                                            datepicker='+'
                                                            placeholder='datepicker' validate={[V.required]}/></td>
                                <td><EPicker datepicker='+'/></td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption'>датавремя</td>
                                <td className='pr12'><Field disabled={disabled} component={FPicker}
                                                            name='datetimepicker'
                                                            datetimepicker='+'
                                                            placeholder='datetimepicker' validate={[V.required]}/></td>
                                <td><EPicker datetimepicker='+'/></td>
                            </tr>
                            </tbody>
                        </table>
                    </Card>
                </Layout.Col>
                <Layout.Col span="6" className='unbleed'>
                    <Card className="box-card" header={<h3 className='ap-h3'>Dropdown</h3>}>
                        <table>
                            <tbody>

                            <tr>
                                <td className='ap-input-caption'>Select</td>
                                <td><Field disabled={disabled} component={FSelect} name='select' dataKey='123'
                                           placeholder='Select'/></td>
                            </tr>
                            <tr>
                                <td className='ap-input-caption'>Select Underlined</td>
                                <td><Field disabled={disabled} component={FSelect} name='select' dataKey='123'
                                           placeholder='Select'
                                           className='ap-select-underlined'/></td>
                            </tr>
                            </tbody>
                        </table>
                    </Card>
                </Layout.Col>
            </Layout.Row>

            <Layout.Row gutter="12" className='my18 mx18'>
                <Layout.Col span="12">
                    <Card className="box-card" bodyStyle={{padding: '0'}} header={<h3 className='ap-h3'>Таблица</h3>}>
                        <DataTable value={tableData}>
                            <Column field="vin" header="Vin"/>
                            <Column field="year" header="Year"/>
                            <Column field="brand" header="Brand"/>
                            <Column field="color" header="Color"/>
                        </DataTable>
                    </Card>
                </Layout.Col>
            </Layout.Row>

            <Button onClick={load}>Сделать чудо</Button>
            <Button type="primary" size='small' onClick={nextPage}>
                                        Далее
                                        <i className="el-icon-arrow-right el-icon-right"/>
                                    </Button>
        </form>
    )
}//

const testAppeal = {"KORPUS":"sdfa","PRED":true,"DOM":"sdfasdf","PINDEX":"asdfdsf","STREET":"fasdf","ishDocsData":[{"id":"idl15","doc_target":"org","ish_num":"","ish_date":null,"podpisal":"","status":"","related_topic":"Shttps://github.com/ElemeFE/cooking","crypto_signature":true,"doc_vid":"Промежуточный ответ","delivery_type":"ЭДО","sheets_count":"sdfgdfgfdg","edo_num":"sfgsdfg","comment":"sggdfgcxvbcvbx","fabulas":{"soprovod":[],"universal":[],"opred":[],"uvedom":[],"vyzov":[],"initiation":[]},"files":[]}],"NPUNKT":"fsdaf","SHEETS_COUNT":"cccc","ECOO_NUM":"dsfsdf","ORG_NAME":"423423","PRED_NAME":"sdfds","RAYON":"sfasd","INN":"4324","organizationsFrom":[{"id":"orc1","name":"sdfsdf","num":"sdfsdfdsf","date":"2019-03-11T21:00:00.000Z"},{"id":"orc2","name":"zcvzxcv","num":"sdfasfd","date":"2019-03-28T21:00:00.000Z"}],"ISH_NUMBER":"32423","REQUEST_TYPE":"Личный приём","KPP":"324234","questions":[{"id":"qlr6","question":"тематика 2","department":"отдел 2"},{"id":"qlr7","question":"тематика 4","department":"отдел 3"},{"id":"qlr8","question":"тематика 4","department":"отдел 3"}],"PHONE":"(324) 343-43__","zajavLic":"UL","topicsData":[{"id":"tcl12","category":"Ходатайство о переносе срока рассмотрения дела об АПН","post_n":"sdgdgdfg","post_date":"2019-03-12T21:00:00.000Z","docs":"Отсутствуют","cause":"","uch_pris":false,"apn_adr":"","apn_date":null,"description":"","owner":"","owner_adr":"","decision":null,"decision_base":null,"chief":null,"decision_date":null,"article":"","regno":"","UCH_PRIS":true,"RASSMOTR_DATE":"2019-03-27T21:00:00.000Z","RASSMOTR_TIME":"2019-03-04T06:49:34.635Z","CODEX_ARTICLE":"fdgsf","OWNER_TS":"sdgdsgfg"},{"id":"tcl13","category":"Ходатайство о восстановлении срока обжалования постановления","post_n":"bxcbcxvb","post_date":"2019-03-17T21:00:00.000Z","docs":"Отсутствуют","cause":"","uch_pris":false,"apn_adr":"","apn_date":null,"description":"","owner":"","owner_adr":"","decision":null,"decision_base":null,"chief":null,"decision_date":null,"article":"","regno":"","CODEX_ARTICLE":"dsgsdfg","UCH_PRIS":true,"RASSMOTR_TIME":"2019-03-04T06:49:02.376Z","RASSMOTR_DATE":"2019-03-12T21:00:00.000Z","OWNER_TS":"zcxvcxzv","OWNER_TS_ADR":"sfsdf","APN_ADR":"sdfd","APN_DATA":"2019-02-26T21:00:00.000Z","DESCRIPTION":"cxvz vzxcv xcvz cvasaa","DECISION_DATE":"2019-03-05T21:00:00.000Z","VIOLATOR_REGNO":"gdsfgdfg"},{"id":"tcl14","category":"Жалоба на работу МАДИ","post_n":"gfdsgfg","post_date":"2019-03-19T21:00:00.000Z","docs":"Отсутствуют","cause":"","uch_pris":false,"apn_adr":"","apn_date":null,"description":"","owner":"","owner_adr":"","decision":null,"decision_base":null,"chief":null,"decision_date":null,"article":"","regno":"","CODEX_ARTICLE":"sdfsdf","OWNER_TS":"sdfsdfsdf"}],"ISH_DATE":"2019-03-14T21:00:00.000Z","STR":"afsdf","TOM":"234","REGION":"adsfsd","SHEETS":"234","PRED_FAM":"dfdsf","PODPIS":"vbcvbcvb","EDO_NUM":"fgdfg","RESPONSE_TYPE":"Лично","OFFICE":"sdfsdaf","EMAIL":"4432@awrq","PRED_SURNAME":"fsdf","organizationsControl":[{"id":"orc3","name":"hgjgfjgf","num":"34523452","date":"2019-03-18T21:00:00.000Z","control_date":"2019-03-26T21:00:00.000Z"},{"id":"orc4","name":"hjfs","num":"wretwert","date":"2019-03-19T21:00:00.000Z","control_date":"2019-02-26T21:00:00.000Z"},{"id":"orc5","name":"drgertertert","num":"ertert","date":"2019-03-21T21:00:00.000Z","control_date":"2019-03-14T21:00:00.000Z"}],"apn_list":[{"id":"qlr9","apn":"rwet","date":"2019-03-26T21:00:00.000Z"},{"id":"qlr10","apn":"dfgsdfg","date":"2019-03-12T21:00:00.000Z"},{"id":"qlr11","apn":"sdfgsdfg","date":"2019-03-19T21:00:00.000Z"}]};

const mapStateToProps = (state) =>{
//debugger;
return  ({     
    initialValues: state.getIn(['general', 'form','appeal']),
    system:    state.getIn(['general', 'system']),
    sessionId: state.getIn(['general', 'user','sessionId'])
});
}
/*
const mapDispatchToProps = (dispatch,props) => {
    testAppeal : 
}
*/
export default compose(
    connect(mapStateToProps/*,mapDispatchToProps*/),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(TestElement2RF)