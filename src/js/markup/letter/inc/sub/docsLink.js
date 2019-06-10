import {reduxForm, arrayPush} from 'redux-form/immutable'
import {compose} from 'redux'
import {connect} from 'react-redux'
import DocLinker from '../../../common/docLinker.js'

const mapStateToProps = (state, props) => {
    let id = state.getIn(['form', 'letter_incoming', 'values','id']);
    const root_doc = 'LETTER';
    const root_dir = 'IN';
    return {id,root_doc,root_dir};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'letter_incoming', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
        //validate
    })
)(DocLinker)