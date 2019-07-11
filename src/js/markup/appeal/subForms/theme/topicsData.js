import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {Button, Card, Layout, Tag} from 'element-react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../../components/switch.js'
import {ESelect, FSelect} from '../../../components/select.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import {ETopicList, FTopicList} from './topicList.js'
import {EOrganizationFrom} from "../organizationFrom";
import {EOrganizationControl} from "../organizationControl";

import mapping from '../../mapping.js'

const headerTitle = 'Темы обращения';
const M = mapping.TopicsData;

const TopicsData = React.memo(props => {
    const {handleSubmit, pristine, nextPage, prevPage, submitting, header, system, disabled,claim_id,dispatch,apn_list,sessionId,responseMode,adminMode,reloadRow,noChanges,adm_app,externalSid} = props;
    const navi = !disabled && (nextPage||prevPage);
    
    const isMadi = system == 'M';

    return (
        <div scrollanchor='topics' id='topics'>
            <Card className="box-card sectionCard" header={
                <div className='headline'>
                    <h3>{headerTitle}</h3>
                </div>
            }>
                <div className="form-container">
                    <form onSubmit={handleSubmit}>
                        <h4 className='ap-h4'>Список тем обращения</h4>
                        <FieldArray name='topics_data' component={FTopicList} {...{disabled,claim_id,dispatch,apn_list,sessionId,responseMode,adminMode,reloadRow,noChanges,adm_app,externalSid}}/>
                    </form>
                </div>
            </Card>
        </div>
    )
}); //

const mapStateToProps = (state) => ({
    externalSid: state.getIn(['general','user','externalSid']),
    adm_app: state.getIn(['general','user','params','ADM_APPLICATION']),
    sessionId:state.getIn(['general','user','sessionID']),
    system:   state.getIn(['general', 'system']),
    claim_id: state.getIn(['form', 'appeal','values','id']),
    apn_list: state.getIn(['form','appeal','values','apn_list'])
});

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(TopicsData)
