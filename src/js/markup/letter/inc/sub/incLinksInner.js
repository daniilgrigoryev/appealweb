import React from 'react'
import {Field, FieldArray, reduxForm, arrayPush} from 'redux-form/immutable'
import {Dialog, Button} from 'element-react'
import * as _ from 'lodash'

import DocLinker from './docLinker.js'
import {FInput, EInput} from '../../../components/finput.js'
import {ESelect, FSelect} from '../../../components/select.js'
import {EPicker, FPicker} from '../../../components/picker.js'
import mapping from '../mapping.js'

const M = mapping.incLinksInner;

const getRow = (npost, desc, docId) => {
    return {
        id: _.uniqueId('ldocs'),
        desc: desc || '',
        docId: docId || null
    }
}

const linkedDocs = (props) => {
    const {fields, disabled, hideLinker, showLinker} = props
    //const add = ()=>fields.push(getRow());
    const add = showLinker;

    const rmv = (ind) => () => fields.remove(ind);
    const inf = (ind) => () => fields.remove(ind); // ! replace me
    const ROWS = fields.map((x, i) => (
        <tr key={i}>
            <td><Field component={FInput} name={x + M.ID.name} value={x[M.ID.name]}
                       disabled={true}/></td>
            <td><Field component={FInput} name={x + M.DESC.name} value={x[M.DESC.name]}
                       disabled={true}/></td>
            <td>{disabled ? null : <button type='button' onClick={inf(i)}>i</button>}</td>
            <td>{disabled ? null : <button type='button' onClick={rmv(i)}>x</button>}</td>
        </tr>)); //

    return (
        <React.Fragment>
            {!fields.length ?
                <p className='mt-neg12 mb18 txt-em txt-s color-gray-light'>Нет связанных документов</p>
                :
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className='ap-table-header'>{M.ID.label}</th>
                                    <th className='ap-table-header'>{M.DESC.label}</th>
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
                                        <Button size="small" icon="plus" onClick={add}
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
        </React.Fragment>);
};

class IncLinkInner extends React.Component {

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
        const {disabled, array, dispatch} = this.props
        const {linkerVisible} = this.state;

        const dialogLink = (args) => {
            _.each(args, (a) => dispatch(arrayPush('outgoing', 'linkedDocs', getRow(a.DATE_CONTROL, a.THEME, _.uniqueId('asd')))));
            this.hideLinker();
        };

        const LINKER = !linkerVisible
            ? null
            : (<Dialog key='ilid'
                       title="Связанные документы"
                       showClose={false}
                       closeOnClickModal={false}
                       closeOnPressEscape={false}
                       visible={linkerVisible}
                       onCancel={this.hideLinker}
                       lockScroll={true}
            >
                <Dialog.Body>
                    <DocLinker dialogLink={dialogLink} dialogClose={this.hideLinker}/>
                </Dialog.Body>

                <Dialog.Footer className="dialog-footer">
                    <Button onClick={this.hideLinker}>Закрыть</Button>
                </Dialog.Footer>
            </Dialog>);

        return [
            <div key='ili'>
                <hr className='txt-hr my18'/>
                <h4 className="ap-h4">Связанные документы:</h4>

                <FieldArray name='linkedDocs' component={linkedDocs} disabled={disabled} showLinker={this.showLinker}
                            hideLinker={this.hideLinker}/>
            </div>,
            LINKER
        ]
    }
}

export default reduxForm({
    form: 'letter_incoming', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IncLinkInner)