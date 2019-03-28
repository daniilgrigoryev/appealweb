import React from 'react'
import {Field, FieldArray, reduxForm} from 'redux-form/immutable'
import {EInput, FInput} from '../../components/finput.js'
import {ESelect, FSelect} from '../../components/select.js'
import {EPicker, FPicker} from '../../components/picker.js'
import {ECheckbox, FCheckbox} from '../../components/checkbox.js'
import {EAutocomplete, FAutocomplete} from '../../components/fautocomplete.js'
import {getAc} from '../../../services/acCacher.js'
import * as _ from 'lodash'
import {Button, Card, Layout, Tag} from 'element-react'
import mapping from '../appealContent/mapping.js'
import {fields, categories, matrix} from './categories.js'

const M = mapping.topicList;

const data2str = (data) =>{
    if (data){
        return (data instanceof Date) ? data.toISOString() : data; 
    }
    return '';
} //(data ? data.toISOString() : '');
const stopPg = (cb, id) => (evt) => {
    evt.stopPropagation();
    cb(id);
    return false;
}

const OFRow = (props) => {
    const {ind, field, value, onChange, onRemove, onInfo, onExpand, checkExpand, disabled,collapse} = props;
    const id = value.get('id')
    
    const expanded = checkExpand(id);
    const onRmv = stopPg(onRemove, ind);
    const onInf = stopPg(onInfo, id);

    const onXpd = () => onExpand(id);
    const P = value;

    const SYS = 'M';
    const FF = fields, FFF = FF.map(x => x.field), CC = categories, CCF = categories.filter(x => x), MM = matrix;

    const CCC = CC.filter(x => x && x.sys.indexOf(SYS) > -1).map(x => x.text);
    const cIndex = CCC.indexOf(P[M.CAT.name]);
    const cRow = MM[cIndex+1]; // lead row offset

    const cif = (field, el) => {
        if (!cRow) {
            return null;
        }
        const fIndex = FFF.indexOf(field);
        return !!cRow[fIndex] ? el : null;
    };

    if (!expanded) {



        debugger;

        const collapsed = (
            <React.Fragment>
                <tr key={id}>
                    <td>
                <span className='ap-table-list-number mr12'>
                {ind + 1}
                 </span>
                    </td>
                    <td>
                 <span className='inline-block mr12'>
                {P.get(M.CAT.name)}
                  </span>
                    </td>
                    <td>
                <span className='inline-block mr12'>
                {P.get(M.POST_N.name)}
                </span>
                    </td>
                    <td>
                <span className='inline-block mr12'>
                {data2str(P.get(M.POST_DATE.name))}
                </span>
                    </td>
                    <td colSpan='2' className='pr12 align-r'>
               <span className="ml12">
                    {disabled ? null :
                        <Button type="text" onClick={onXpd}>
                            <i className="el-icon-edit color-green"/>
                        </Button>
                    }

                   {disabled ? null :
                       <Button type="text" onClick={onInf}>
                           <i className="el-icon-information color-blue"/>
                       </Button>
                   }

                   {disabled ? null :
                       <Button type="text" onClick={onRmv}>
                           <i className="el-icon-delete color-red-dark"/>
                       </Button>
                   }
               </span>
                    </td>
                </tr>
                <tr>
                    <td colSpan='6'>
                        <hr className='txt-hr my18'/>
                    </td>
                </tr>
            </React.Fragment>);
        return [collapsed];
    }

    const PRIS_UCH = (!P[M.UCH_PRIS.name]) ? null : [
        <tr key='pu1'>
            <td className='ap-input-caption'>{M.RASSMOTR_DATE.label}</td>
            <td>
                <Field disabled={disabled} component={FPicker} name={field + M.RASSMOTR_DATE.name}
                       value={P[M.RASSMOTR_DATE.name]} datetimepicker='+'/>
            </td>
        </tr>
        ,
        <tr key='pu3'>
            <td></td>
            <td>
                <Button type="text" size="small">
                    <span className='color-blue'>Зарезервировать слот в СУО</span>
                </Button>
            </td>
        </tr>];
//
    const editable =
        <React.Fragment>
            <tr>
                <td colSpan='6'>
                    <div className='px12 py12 my6 ml-neg12 border round border--gray-light shadow-darken10'>
                        <table className='wmax600'>
                            <tbody>
                            <tr key={id + 'e1'}>
                                <td>
                                <span className='ap-table-list-number mr12'>
                                 {ind + 1}
                                 </span>
                                </td>
                                <td>
                                <span className='inline-block mr12'>
                                <Field disabled={disabled} component={FSelect} name={field + M.CAT.name}
                                       placeholder={M.CAT.label}
                                       dataKey={M.CAT.key} value={P[M.CAT.name]}/>
                                </span>
                                </td>
                                <td>
                                <span className='inline-block mr12'>
                                    <Field disabled={disabled} component={FInput} name={field + M.POST_N.name}
                                           placeholder={M.POST_N.label}
                                           value={P[M.POST_N.name]}/>
                                 </span>
                                </td>
                                <td>
                                <span className='inline-block mr12'>
                                    <Field disabled={disabled} component={FPicker} name={field + M.POST_DATE.name}
                                           placeholder={M.POST_DATE.label}
                                           value={P[M.POST_DATE.name]} datepicker='+'/>
                                </span>
                                </td>
                                <td></td>
                                <td></td>
                            </tr>

                            <tr>
                                <td colSpan='6'>
                                    <h4 className="ap-h4">Детальная информация по теме</h4>
                                </td>
                            </tr>

                            <tr key={id + 'e2'}>
                                <td colSpan='5'>
                                    <table>
                                        <tbody>
                                        <tr>
                                            <td className='ap-input-caption'>{M.REL_DOCS.label}</td>
                                            <td className='ap-input ap-input--disabled'>{P[M.REL_DOCS.name]}</td>
                                        </tr>
                                        <tr>
                                            <td className='ap-input-caption'>{M.UCH_PRIS.label}</td>
                                            <td><Field disabled={disabled} component={FCheckbox}
                                                       value={P[M.UCH_PRIS.name]}
                                                       name={field + M.UCH_PRIS.name}/></td>
                                        </tr>
                                        {PRIS_UCH}

                                        {cif(M.CODEX_ARTICLE.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.CODEX_ARTICLE.label}</td>
                                                <td><Field disabled={disabled} component={FInput}
                                                           value={P[M.CODEX_ARTICLE.name]}
                                                           name={field + M.CODEX_ARTICLE.name}/></td>
                                            </tr>)
                                        )}
                                        {cif(M.OWNER_TS.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.OWNER_TS.label}</td>
                                                <td><Field disabled={disabled} component={FInput}
                                                           value={P[M.OWNER_TS.name]}
                                                           name={field + M.OWNER_TS.name}/></td>
                                            </tr>)
                                        )}
                                        {cif(M.OWNER_TS_ADR.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.OWNER_TS_ADR.label}</td>
                                                <td><Field disabled={disabled} component={FInput}
                                                           value={P[M.OWNER_TS_ADR.name]}
                                                           name={field + M.OWNER_TS_ADR.name}/></td>
                                            </tr>)
                                        )}
                                        {cif(M.APN_ADR.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.APN_ADR.label}</td>
                                                <td><Field disabled={disabled} component={FInput}
                                                           value={P[M.APN_ADR.name]}
                                                           name={field + M.APN_ADR.name}/></td>
                                            </tr>)
                                        )}
                                        {cif(M.APN_DATA.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.APN_DATA.label}</td>
                                                <td><Field disabled={disabled} component={FPicker}
                                                           value={P[M.APN_DATA.name]}
                                                           name={field + M.APN_DATA.name} datepicker='+'/></td>
                                            </tr>)
                                        )}
                                        {cif(M.DESCRIPTION.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.DESCRIPTION.label}</td>
                                                <td><Field disabled={disabled} component={FInput}
                                                           value={P[M.DESCRIPTION.name]}
                                                           name={field + M.DESCRIPTION.name} type="textarea"/></td>
                                            </tr>)
                                        )}
                                        {cif(M.DECISION_DATE.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.DECISION_DATE.label}</td>
                                                <td><Field disabled={disabled} component={FPicker}
                                                           value={P[M.DECISION_DATE.name]}
                                                           name={field + M.DECISION_DATE.name} datepicker='+'/></td>
                                            </tr>)
                                        )}
                                        {cif(M.VIOLATOR_REGNO.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.VIOLATOR_REGNO.label}</td>
                                                <td><Field disabled={disabled} component={FInput}
                                                           value={P[M.VIOLATOR_REGNO.name]}
                                                           name={field + M.VIOLATOR_REGNO.name}/></td>
                                            </tr>)
                                        )}
                                        {cif(M.APPEAL_CAUSE.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.APPEAL_CAUSE.label}</td>
                                                <td><Field disabled={disabled} component={FSelect}
                                                           value={P[M.APPEAL_CAUSE.name]}
                                                           name={field + M.APPEAL_CAUSE.name} dataKey={M.APPEAL_CAUSE.key}/>
                                                </td>
                                            </tr>)
                                        )}
                                        {cif(M.DESISION_MAKER.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.DESISION_MAKER.label}</td>
                                                <td><Field disabled={disabled} component={FSelect}
                                                           value={P[M.DESISION_MAKER.name]}
                                                           name={field + M.DESISION_MAKER.name}
                                                           dataKey={M.DESISION_MAKER.key}/>
                                                </td>
                                            </tr>)
                                        )}
                                        {cif(M.DECISION_THEME.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.DECISION_THEME.label}</td>
                                                <td><Field disabled={disabled} component={FSelect}
                                                           value={P[M.DECISION_THEME.name]}
                                                           name={field + M.DECISION_THEME.name}
                                                           dataKey={M.DECISION_THEME.key}/>
                                                </td>
                                            </tr>)
                                        )}
                                        {cif(M.DECISION_BASIS.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.DECISION_BASIS.label}</td>
                                                <td><Field disabled={disabled} component={FSelect}
                                                           value={P[M.DECISION_BASIS.name]}
                                                           name={field + M.DECISION_BASIS.name}
                                                           dataKey={M.DECISION_BASIS.key}/>
                                                </td>
                                            </tr>)
                                        )}
                                        {cif(M.APPEAL_APN.name,
                                            (<tr>
                                                <td className='ap-input-caption'>{M.APPEAL_APN.label}</td>
                                                <td><Field disabled={disabled} component={FSelect}
                                                           value={P[M.APPEAL_APN.name]}
                                                           name={field + M.APPEAL_APN.name} dataKey={M.APPEAL_APN.key}/>
                                                </td>
                                            </tr>)
                                        )}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <hr className='txt-hr my18'/>
                        <div className='flex-parent flex-parent--space-between-main flex-parent--center-cross'>
                            <Button type="text" size="small" onClick={collapse}>
                                <span className='color-blue'>Свернуть</span>
                            </Button>
                            <div>
                                {disabled ? null :
                                    <Button type="text" onClick={onInf}>
                                        <i className="el-icon-information color-blue"/>
                                    </Button>
                                }

                                {disabled ? null :
                                    <Button type="text" onClick={onRmv}>
                                        <i className="el-icon-delete color-red-dark"/>
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan='6'>
                    <hr className='txt-hr my18'/>
                </td>
            </tr>
        </React.Fragment>
    ;
    return editable;
} //


const getRow = (id,category, post_n, post_date, docs, cause, uch_pris, apn_adr, apn_date, description, owner, owner_adr, decision, decision_base, chief, decision_date, article, regno) => {
    return {
        id: id||null,
        category: category || '',
        post_n: post_n || '',
        post_date: post_date || null,
        docs: docs || 'Отсутствуют',
        cause: cause || '',
        uch_pris: !!uch_pris || false,
        apn_adr: apn_adr || '',
        apn_date: apn_date || null,
        description: description || '',
        owner: owner || '',
        owner_adr: owner_adr || '',
        decision: decision || null,
        decision_base: decision_base || null,
        chief: chief || null,
        decision_date: decision_date || null,
        article: article || '',
        regno: regno || ''
    }
}

// Element component
class ETopicList extends React.Component {

    constructor(props) {
        super(props);
        const eid = _.chain(this.props.fileds).first().get('id').value();
        this.state = {
            acCateg: null,
            expandedId: eid
        };
    }

    getCategValue(property) {
        const {acCateg} = this.state;
        return !_.size(acCateg)
            ? property
            : _.chain(acCateg).filter(x => x.property == property).first().get('value').value();
    }

    onRemove(index) {
        const P = this.props;
        const {reduxformfield, input} = P;
        const {expandedId} = this.state;

        const rows = this.props.fields;
        const rowId = rows.get(index).id;
        rows.remove(index);

        let newExpandedId = null;
        if (rowId == expandedId) {
            if (rows.length == 1) {
                newExpandedId = rows[0].id;
            } else {
                newExpandedId = rows[Math.max(0, index - 1)].id;
            }
        }
        this.setState({expandedId: newExpandedId});
    }

    onInfo(rowId) {
        ;
    }


    onExpand(expandedId) {
        this.setState({expandedId});
    }

    render() {
        const rmv = this.onRemove.bind(this);
        const inf = this.onInfo.bind(this);
        const xpd = this.onExpand.bind(this);
        const getV = this.getCategValue.bind(this);

        const {fields, disabled} = this.props;

        debugger;

        const ROWS = fields.map((x, i, arr) => (
            <OFRow key={i}
                   ind={i}
                   checkExpand={(id) => id == this.state.expandedId}
                   collapse={()=>this.setState({expandedId:false})}
                   field={x}
                   value={arr.get(i)}
                   onRemove={rmv}
                   onInfo={inf}
                   onExpand={xpd}
                   getValue={getV}
                   disabled={disabled}>
                {x.value}
            </OFRow>)); //
        const add = () => fields.push(getRow()); 

        return (
            <React.Fragment>
                {!fields.length ?
                    <p className='mt-neg18 mb18 txt-em color-gray'>Нет добавленных тем обращения</p>
                    :
                    <table className='wmin600 mb18'>
                        <thead>
                        <tr>
                            <th className='ap-table-header'>№</th>
                            <th className='ap-table-header'>{M.CAT.label}</th>
                            <th className='ap-table-header'>{M.POST_N.label}</th>
                            <th className='ap-table-header'>{M.POST_DATE.label}</th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {ROWS}
                        </tbody>
                    </table>
                }

                {disabled ? null :
                    <Button size="small" icon="plus" type="success" plain={true} onClick={add}
                            className="flex-parent mb18"
                            title='Добавить тему'>Добавить</Button>
                }
            </React.Fragment>
        )
    }; //
}

const FTopicList = (props) => {
    const {input, meta} = props;
    return <ETopicList {...props} {...input} {...meta} reduxformfield="true"/>
};


export {ETopicList, FTopicList};