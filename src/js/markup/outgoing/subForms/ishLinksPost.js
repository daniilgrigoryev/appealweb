import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {FInput, EInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import * as _ from 'lodash'
import {Button, Card, Layout} from 'element-react'
import mapping from '../mapping.js'

const M = mapping.ishLinksPost;

const getRow = (id, npost, date) => {
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

        <div className="row" key={i}>
            <div className="column">
                <div className="label">{M.NPOST.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FInput} name={x + M.NPOST.name} value={x[M.NPOST.name]}/>
                </div>
            </div>
            <div className="column">
                <div className="label">{M.DATE.label}</div>
                <div className="value">
                    <Field disabled={disabled} component={FPicker} name={x + M.DATE.name} value={x[M.DATE.name]}/>
                </div>
            </div>
            <div className="column column--end">
                <div className="value">
                {disabled ? null :
                    <Button className="py0" size="small" type="text" onClick={rmv(i)}>
                        <i className="ico round minus"/>
                    </Button>
                }
                {disabled ? null :
                    <Button className="py0" size="small" type="text" onClick={add} plain={true}>
                        <i className="ico round plus"/>
                    </Button>
                }
                </div>
            </div>
        </div>));
//
    return (
        <React.Fragment>
            {!fields.length 
                ? <p className='my6 txt-em color-gray align-center'>Нет добавленных постановлений</p>
                : <div className="flex-table mb6">
                    {ROWS}
                  </div>
            }

            {disabled || fields.length ? null :
                <Button size="small" icon="plus" onClick={add} plain={true} className="mb18 mt6 mx-auto block" title='Добавить постановление'>Добавить постановление</Button>
            }
        </React.Fragment>);
};

class IshLinkPost extends React.Component {

    render() {
        const {disabled} = this.props
        return (
            <div className="form-container my24">
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