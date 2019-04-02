import React, { Component } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {EFileInput,FFileInput} from  '../../components/fileInput.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../components/switch.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {EOrganizationFrom, FOrganizationFrom} from '../subForms/organizationFrom.js'
import {EOrganizationControl, FOrganizationControl} from '../subForms/organizationControl.js'
import {Button, Card, Layout, Tag} from 'element-react'
import {scanPdf} from '../../../services/scanService.js'

import mapping from './mapping.js'

const headerTitle = 'Дополнительные материалы';
const M = mapping.organizationsData;

class PlusDocs   extends Component {

    async scan(){
        debugger;
        const pdfBlob = await scanPdf();


        debugger;

        /*
        const reader = new FileReader(); // чтение файла в браузере без загрузки на сервер
        reader.onload = (e)=>{ // загрузка-чтение завершены
            const strBinary = e.target.result;
            debugger;
        };
        reader.readAsBinaryString(pdfBlob); // старт чтения, в коллбеке base64 строка
        */
    }

    render(){
        const {handleSubmit, pristine, nextPage, prevPage, submitting, header, system, disabled} = this.props;
        const isMadi = system == 'M';
        const navi = !disabled && (nextPage||prevPage);
        
        return (
            <div scrollAnchor='organizations'>
                <Layout.Row gutter="20">
                    <Layout.Col span="24">
                    {/*<Layout.Col span="16" offset="4">*/}
                        <Card className="box-card" header={
                            <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                                <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                    {headerTitle}
                                </h3>

                                {!navi
                                    ? null
                                    : (<div>
                                        <Tag type="gray" className='mx12'>3/8</Tag>

                                        <Button.Group>
                                            <Button type="primary" size='small' icon="arrow-left" onClick={prevPage.bind(isMadi)}/>
                                            <Button type="primary" size='small' onClick={nextPage}>
                                                <i className="el-icon-arrow-right el-icon-right"/>
                                            </Button>
                                        </Button.Group>
                                    </div>)
                                }
                            </div>
                        }>
                            <form onSubmit={handleSubmit}>
                                    <Field component={EFileInput}
                                         name="add_doc"
                                         label="Others:"
                                         classNameLabel="file-input-label"
                                         className="file-input"
                                         dropzone_options={{
                                            multiple: false,
                                            accept: 'image/*'
                                          }}

                                         ch={<span>Add more</span>} 
                                        />  


                                        <Button onClick={this.scan.bind(this)}>
                                            Сканировать
                                        </Button>


                            </form>
                        </Card>
                    </Layout.Col>
                </Layout.Row>
            </div>);
    }
}; //

const mapStateToProps = (state) => ({system: state.getIn(['general', 'system'])});

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(PlusDocs)