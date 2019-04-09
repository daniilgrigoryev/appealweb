import React from 'react'
import {Field, FieldArray, reduxForm, arrayPush} from 'redux-form/immutable'
import {Dialog, Button, Card, Layout, Ta} from 'element-react'
import * as _ from 'lodash'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {post,response} from '../../../services/ajax.js'
import DocLinker from '../../outgoing/subForms/docLinker.js'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {messageSet} from '../../../actions/common.js'
import mapping from './mapping.js'

const M = mapping.ishLinksInner;

const linkedDocs = (props) => {
    const {fields, disabled, hideLinker, showLinker,dispatch} = props
    const add = showLinker;

    const rmv = (indx) => async () => { // replace with db call needed
       const alias = 'REMOVE_LINK_TABLE';
       try {
            const LINK_ID = fields.get(indx).get('link_id');
            response(await post('db/select',{alias,LINK_ID}));
            fields.remove(indx);
       } catch (exc){
            dispatch(messageSet(ecx,'error'));
       }
    } 
    const inf = (ind) => () => fields.remove(ind); // ! replace me
    const ROWS = fields.map((x, i)=>(
        <tr key={i}>
            <td><Field component={FInput} name={x + 'name'}                value={x.name}                disabled={true}/></td>
            <td><Field component={FInput} name={x + 'registration_number'} value={x.registration_number} disabled={true}/></td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>Удалить</button>}</td>
        </tr>)); //

    //<td>{disabled ? null : <button type='button' onClick={inf(i)}>I</button>}</td>
            
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
                                    <th className='ap-table-header'>Документ</th>
                                    <th className='ap-table-header'>Регистрационный номер</th>
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

class DocsLink extends React.Component {

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
        const {disabled, array, dispatch,id,reloadRow} = this.props
        const {linkerVisible} = this.state;

        const CONTENT = (!id) 
            ? (<div>
                    <span>Связывание возможно только для зарегистрированных документов</span>
                </div>) 
            : (<div key='ili'>
                    <FieldArray name='linked_docs' component={linkedDocs} disabled={disabled} showLinker={this.showLinker} hideLinker={this.hideLinker}/>
                </div>)
        

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
                    <DocLinker dialogClose={this.hideLinker} reloadRow={reloadRow} root_id={id} root_doc={'CLAIM'} root_dir={'IN'}/>
                </Dialog.Body>
            </Dialog>); //


            return [
                <div scrollAnchor='links' key='ili'>
                    <Layout.Row gutter="20">
                        <Layout.Col span="24">
                        {/*<Layout.Col span="16" offset="4">*/}
                            <Card className="box-card" header={
                                <div className='flex-parent flex-parent--center-cross flex-parent--space-between-main'>
                                    <h3 className='ap-h3 flex-parent flex-parent--center-cross'>
                                        Связанные документы:
                                    </h3>                                    
                                </div>
                            }>
                                {CONTENT}
                            </Card>
                        </Layout.Col>
                    </Layout.Row>
                </div>,
                LINKER
                ];
    };
} //


const mapStateToProps = (state, props) => {
    let formData = state.getIn(['form', 'appeal', 'values']);
    let id = state.getIn(['form', 'appeal', 'values','id']);
    return {formData,id};
}

export default compose(
    connect(mapStateToProps),
    reduxForm({
        form: 'appeal', // <------ same form name
        destroyOnUnmount: false, // <------ preserve form data
        forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
        //validate
    })
)(DocsLink)