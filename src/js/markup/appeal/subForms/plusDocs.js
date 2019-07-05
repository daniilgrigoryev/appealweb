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
import {EOrganizationFrom, FOrganizationFrom} from './organizationFrom.js'
import {EOrganizationControl, FOrganizationControl} from './organizationControl.js'
import {Button, Card, Layout, Tag} from 'element-react'
import {scanPdf} from '../../../services/scanService.js'
import FilesStorage from '../../components/filesStorage.js'

import mapping from '../mapping.js'

const headerTitle = 'Дополнительные материалы';
const M = mapping.organizationsData;

class PlusDocs extends Component {

    render(){
        const {handleSubmit, pristine, nextPage, prevPage, submitting, header, system, disabled,files,dispatch, change} = this.props;
        const isMadi = system == 'M';
        const navi = !disabled && (nextPage||prevPage);
        
        const setFiles = (immutableFileList)=>{
            dispatch(change('files',immutableFileList));
        }

        return (
            <div scrollanchor='organizations'>
                <Card className="box-card sectionCard" header={
                    <div className='headline'>
                        <h3>
                            {headerTitle}
                        </h3> 
                    </div>
                }>
                <div className="form-container">
                    <FilesStorage {...{files,setFiles,}} disabled={disabled} />
                </div>
                </Card>
            </div>);
    }
}; //

const mapStateToProps = (state) => {
    return {
        files: state.getIn(['form','appeal','values','files']),
        system: state.getIn(['general', 'system'])
    }
};

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(PlusDocs)
