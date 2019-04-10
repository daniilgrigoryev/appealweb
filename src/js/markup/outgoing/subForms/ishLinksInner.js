import React from 'react'
import {Field, FieldArray, reduxForm, arrayPush} from 'redux-form/immutable'
import {Dialog, Button} from 'element-react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {connect} from 'react-redux'
//import DocLinker from './docLinker.js'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import mapping from '../mapping.js'

import DocLinker from '../../common/docLinker.js'
/*
const M = mapping.ishLinksInner;

const getRow = (id,npost, desc, docId) => {
    return {
        id: id || null,
        desc: desc || '',
        docId: docId || null
    }
}

const linkedDocs = (props) => {
    const {fields, disabled, hideLinker, showLinker} = props
    const add = showLinker;

    const rmv = (ind) => () => fields.remove(ind); // replace with db call needed
    const inf = (ind) => () => fields.remove(ind); // ! replace me
    const ROWS = fields.map((x, i)=>(
        <tr key={i}>
            <td><Field component={FInput} name={x + M.ID.name}   value={x[M.ID.name]}   disabled={true}/></td>
            <td><Field component={FInput} name={x + M.DESC.name} value={x[M.DESC.name]} disabled={true}/></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
        </tr>)); //

    return (
        <React.Fragment>
            {!fields.length 
                ? <p className='mt-neg18 mb18 txt-em color-gray'>Нет связанных документов</p>
                : <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className='ap-table__header'>{M.ID.label}</th>
                                    <th className='ap-table__header'>{M.DESC.label}</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ROWS}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    </tbody>
                </table>
            }

            <table>
                <tbody>
                <tr>
                    <td className='ap-input-caption'></td>
                    <td>
                        <table className='wmin300'>
                            <tbody>
                            <tr>
                                <td colSpan='3'>
                                    {disabled ? null :
                                        <Button size="small" icon="plus" onClick={add} type="success" plain={true}
                                                className="flex-parent mb18"
                                                title='Добавить адресата'>Добавить</Button>
                                    }
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                </tbody>
            </table>
        </React.Fragment>
    ); //
}

class IshLinkInner extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            linkerVisible: false
        }

        this.showLinker = this.showLinker.bind(this);
        this.hideLinker = this.hideLinker.bind(this);
    }

    showLinker() {
        this.setState({linkerVisible: true});
    }

    hideLinker() {
        this.setState({linkerVisible: false});
    }

    render() {
        const {disabled, array, dispatch,id} = this.props
        const {linkerVisible} = this.state;

        if (!id){
            return (<div>
                    <span>Связывание возможно только для зарегистрированных документов</span>
                </div>);
        } //

        const LINKER = !linkerVisible
            ? null
            : (<Dialog key='ilid'
                       title="Связанные документы"
                       showClose={false}
                       closeOnClickModal={false}
                       closeOnPressEscape={false}
                       visible={linkerVisible}
                       onCancel={this.hideLinker}
                       lockScroll={true} >

                <Dialog.Body>
                    <DocLinker dialogClose={this.hideLinker} root_id={id} root_doc={'CLAIM'} root_dir={'OUT'}/>
                </Dialog.Body>
            </Dialog>); //

        return [
            <div key='ili'>
                <hr className='txt-hr my18'/>
                <h4 className='ap-h4'>Связанные документы:</h4>

                <FieldArray name='linkedDocs' component={linkedDocs} disabled={disabled} showLinker={this.showLinker} hideLinker={this.hideLinker}/>
            </div>,
            LINKER
        ]
    };
} */

/*
const mapStateToProps = (state, props) => {
    let formData = state.getIn(['form', 'outgoing', 'values']);
    let id = state.getIn(['form', 'outgoing', 'values','id']);
    return {formData,id};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'outgoing', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
        //validate
    })
)(IshLinkInner)*/


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