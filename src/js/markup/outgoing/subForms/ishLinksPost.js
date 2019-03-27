import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import {Button} from 'element-react'
import mapping from '../mapping.js'

const M = mapping.ishLinksPost;

const getRow = (id,npost, date) => {
    return {
        id: id || null,
        npost: npost || '',
        date: date || null
    }
}

const posts = (props) => {
    const {fields, disabled} = props
    const add = () => fields.push(getRow());
    const rmv = (ind) => () => fields.remove(ind);
    const inf = (ind) => () => fields.remove(ind); // ! replace me
    const ROWS = fields.map((x, i) => (
        <tr key={i}>
            <td>
              <span className='ap-table-list-number mr12'>
                 {i + 1}
             </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FInput} name={x + M.NPOST.name} value={x[M.NPOST.name]}/>
                </span>
            </td>
            <td>
                <span className='inline-block mr12'>
                    <Field disabled={disabled} component={FPicker} name={x + M.DATE.name} value={x[M.DATE.name]}/>
                </span>
            </td>
            <td>
                {disabled ? null :
                    <Button type="text" onClick={inf(i)}>
                        <i className="el-icon-information color-blue"/>
                    </Button>
                }

                {disabled ? null :
                    <Button type="text" onClick={rmv(i)}>
                        <i className="el-icon-delete color-red-dark"/>
                    </Button>
                }
            </td>
        </tr>));
//
    return (
        <React.Fragment>
            {!fields.length ?
                <p className='mt-neg18 mb18 txt-em color-gray'>Нет добавленных постановлений</p>
                :
                <table>
                    <tbody>
                    <tr>
                        <td className='ap-input-caption'></td>
                        <td>
                            <table>
                                <thead>
                                <tr>
                                    <th className='ap-table-header'>№</th>
                                    <th className='ap-table-header'>{M.NPOST.label}</th>
                                    <th className='ap-table-header'>{M.DATE.label}</th>
                                    <th></th>
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
                                        <Button size="small" icon="plus"  onClick={add} type="success" plain={true}
                                                className="flex-parent mb18"
                                                title='Добавить постановление'>Добавить</Button>
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

class IshLinkPost extends React.Component {

    render() {
        const {disabled} = this.props
        return (
            <div>
                <hr className='txt-hr my18'/>
                <h4 className='ap-h4'>Список постановлений:</h4>
                <FieldArray name={M.POSTS.name} component={posts} disabled={disabled}/>
            </div>
        )
    }
}

export default reduxForm({
    form: 'outgoing', // <------ same form name
    destroyOnUnmount: false, // <------ preserve form data
    forceUnregisterOnUnmount: true//, // <------ unregister fields on unmount
    //validate
})(IshLinkPost)