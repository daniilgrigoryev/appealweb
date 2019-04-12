import {reduxForm, arrayPush} from 'redux-form/immutable'
import {compose} from 'redux'
import {connect} from 'react-redux'
import DocLinker from '../../common/docLinker.js'

const mapStateToProps = (state, props) => {
    let id = state.getIn(['form', 'appeal', 'values','id']);
    const root_doc = 'CLAIM';
    const root_dir = 'IN';
    return {id,root_doc,root_dir};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
        //validate
    })
)(DocLinker)