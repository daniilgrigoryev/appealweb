import {reduxForm} from 'redux-form/immutable'
import {compose} from 'redux'
import {connect} from 'react-redux'
import DocLinker from '../../common/docLinker.js'

const mapStateToProps = (state, props) => {
    let id = state.getIn(['form', 'outgoing', 'values','id']);
    const root_doc = 'CLAIM';
    const root_dir = 'OUT';
    return {id,root_doc,root_dir};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'outgoing', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
        //validate
    })
)(DocLinker)