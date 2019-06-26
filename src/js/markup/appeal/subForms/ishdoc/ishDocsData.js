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
            fabulaDocTypes: []
        }
    }

    componentDidMount(){
        const alias = 'AVAILABLE_FAB_DOC_TYPES';
        const listValueField = 'value';
        post('db/select',{alias,listValueField}).then(x=>this.setState({fabulaDocTypes:x.data}));
    }

    render(){
        const props = this.props;
        const {handleSubmit,disabled,categories,claim_id,dispatch,change,initialize,sessionId,reloadRow,noChanges} = props;
        const fTypes = this.state.fabulaDocTypes;
        const p = {disabled,categories,claim_id,fTypes,dispatch,change,initialize,sessionId,reloadRow,noChanges};

        return (
            <div scrollanchor='ishDoc'>
                <Layout.Row gutter="20">
                    <Layout.Col span="24">
                        <Card className="box-card" header={
                            <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                                <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                    {headerTitle}
                                </h3>
                            </div>
                        }>
                            <form onSubmit={handleSubmit}>
                                <h4 className='ap-h4'>Проекты документов</h4>
                                <FieldArray name='ish_docs_data' component={FIshDocList} {...p}/>
                            </form>
                        </Card>
                    </Layout.Col>
                </Layout.Row>
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
