import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../../components/finput.js'
import {EAutocomplete, FAutocomplete} from '../../../components/fautocomplete.js'
import {ECheckbox, FCheckbox} from '../../../components/checkbox.js'
import {ESwitch, FSwitch} from '../../../components/switch.js'
import {ESelect, FSelect} from '../../../components/select.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import {EIshDocList, FIshDocList} from './ishDocList.js'
import {Button, Card, Layout, Tag} from 'element-react'
import {post} from '../../../../services/ajax.js'
import {getSessionId, getSystem} from '../../../../selectors/common.js'
import mapping from '../../mapping.js'

const headerTitle = 'Исходящие документы';

class IshDocsData extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            fabulaDocTypes: [],
            postList: []
        }
    }

    componentDidMount(){
        const listValueField = 'value';
        post('db/select',{alias: 'AVAILABLE_FAB_DOC_TYPES' ,listValueField}).then(x=>this.setState({fabulaDocTypes:x.data}));
        //post('db/select',{alias: 'STAMP_POST_LIST' ,listValueField}).then(x=>this.setState({postList:x.data}));
    }

    render(){
        const props = this.props;
        const {handleSubmit,disabled,categories,claim_id,dispatch,change,initialize,sessionId,reloadRow,noChanges,adm_app} = props;
        const fTypes = this.state.fabulaDocTypes;
        const {postList} = this.state;
        const p = {disabled,categories,claim_id,fTypes,postList,dispatch,change,initialize,sessionId,reloadRow,noChanges,adm_app};

        return (
            <div scrollanchor='ishDoc' id='ishDoc'>
                <Card className="box-card sectionCard" header={
                    <div className="headline">
                        <h3>{headerTitle}</h3>
                    </div>
                }>
                    <form onSubmit={handleSubmit}>
                        <div className="form-container">
                            <h4 className='ap-h4'>Проекты документов</h4>
                            <FieldArray name='ish_docs_data' component={FIshDocList} {...p}/>
                        </div>
                    </form>
                </Card>
            </div>
        )
    }
} //

const mapStateToProps = (state,props)=>{
    const claim_id = state.getIn(['form','appeal','values','id']);
    const form_values = state.getIn(['form','appeal','values']);
    const sys = getSystem(state);
    const sessionId = getSessionId(state);
    return {claim_id,sys,form_values,sessionId};
}

export default compose(
    connect(mapStateToProps/*,mapDispatchToProps*/),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true // <------ unregister fields on unmount
        //validate
    })
)(IshDocsData)
