import React, { useState } from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import Immutable from 'immutable'
import {Card, Layout, Button} from 'element-react'
import {EInput} from '../components/finput.js'
import {EAutocomplete} from '../components/fautocomplete.js'
import {getAc,getAcValue,getAcNoCache} from '../../services/acCacher.js'
import {post} from '../../services/ajax.js'

import mapping from '../appeal/mapping.js'

const im = (obj)=> Immutable.fromJS(obj)

const M = mapping.claimantData;
const alias_push = "ADDR_PUSH";
const alias_get  = "ADDR_GET";

class AddressData extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            isStr : true,
            fullAddr: this.props.fullAddr
        }

        this.changeMode = this.changeMode.bind(this);
        this.save = this.save.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onListChange = this.onListChange.bind(this);
    }
  
    save() {
        const {sid, cBack} = this.props;
        const FULL = this.state.fullAddr;
        const alias = alias_push;

        let dat = {
            country_code_i: null,
            street_id : FULL.street_id || null,
            street_name_i : null,
            city_id : FULL.city_id || null,
            npunkt_tip_kod_i : null,
            npunkt_name_i : null,
            rayon_id : FULL.rayon_id || null,
            rayon_name_i : null,
            region : FULL.region || null,
            region_kod_i : null,
            dom : FULL.dom || null,
            korpus : FULL.korpus || null,
            str : FULL.str || null,
            pindex : FULL.pindex || null,
            okato_i: null,
            kvart: FULL.kvart || null
        }
        
        post('db/select',{alias,sid,...dat}).then(x=>{
            const D = x.data;
            if (D && !D.error && D.rows && D.rows[0]) {
                const [CDR,lineAddr] = D.rows[0];
                if (CDR && lineAddr) {
                    let arrayAgg = _.reduce(_.toPairs(dat), (res, val) => (res.push({name:val[0],value:val[1]}),res),[]);
                    arrayAgg.push({name : 'cdr_address_id', value : CDR.value}); 
                    arrayAgg.push({name : 'line_adr', value : lineAddr.value});
                    cBack(arrayAgg);
                }
            }
        });

        const isS = !this.state.isStr;
        this.setState({isStr : isS});
    }

    changeMode() {
        const isS = !this.state.isStr;
        this.setState({isStr : isS});
    }

    onListChange(val,field) {
        let newState = Object.assign({},this.state);
        if (field==M.REGION.name){
            newState.fullAddr['rayon_id'] = '';
            newState.fullAddr['city_id'] = '';
            newState.fullAddr['street_id'] = '';
        }
        if (field=='rayon_id') {
            newState.fullAddr['city_id'] = '';
            newState.fullAddr['street_id'] = '';
        }
        if (field=='city_id') {
            newState.fullAddr['street_id'] = '';
        }
        newState.fullAddr[field] = val;
        this.setState(newState);
    }

    onFieldChange(field,value){
        let newState = Object.assign({},this.state);
        newState.fullAddr[field] = value;
        this.setState(newState);
    }

    render() {
        const {children,disabled} = this.props;
        const F = this.state.fullAddr;
        const line_adr = F.line_adr;
        const placeholder = children || line_adr || '';     
        
        const ADDRESS = this.state.isStr
                ? (<tr>
                        <td colSpan='2'>
                            {disabled ? null : 
                                <Button size="small" icon="plus" type="success" plain={true}
                                    className="flex-parent mb18"
                                    title='Раскрыть' onClick={this.changeMode}>Редактировать</Button>}
                        </td>
                        <td>{placeholder}</td>

                    </tr>
                )
                : (
                    <React.Fragment><tr>
                        <td className='ap-input-caption'>{M.REGION.label}</td>
                        <td colSpan='3'><EAutocomplete value={F[M.REGION.name]} key={F[M.REGION.name]} onChange={(val)=>this.onListChange(val,M.REGION.name)} dataKey={M.REGION.key} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.RAYON.label}</td>
                        <td colSpan='3'><EAutocomplete value={F['rayon_id']} key={F['rayon_id']} onChange={(val)=>this.onListChange(val,'rayon_id')} dataWhere={_.pick(F, [M.REGION.name])} dataKey={M.RAYON.key} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.NPUNKT.label}</td>
                        <td colSpan='3'><EAutocomplete value={F['city_id']} key={F['city_id']} onChange={(val)=>this.onListChange(val,'city_id')} dataWhere={_.pick(F, [M.REGION.name, 'rayon_id'])} dataKey={M.NPUNKT.key}  /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.STREET.label}</td>
                        <td colSpan='3'><EAutocomplete value={F['street_id']} key={F['street_id']} onChange={(val)=>this.onListChange(val,'street_id')} dataWhere={_.pick(F, [M.REGION.name,'rayon_id','city_id'])} dataKey={M.STREET.key}  /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.DOM.label}</td>
                        <td><EInput value={F[M.DOM.name]} onChange={(v)=>this.onFieldChange([M.DOM.name],v)}/></td>
                        <td className='ap-input-caption'>{M.KORPUS.label}</td>
                        <td><EInput value={F[M.KORPUS.name]} onChange={(v)=>this.onFieldChange([M.KORPUS.name],v)} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.STR.label}</td>
                        <td><EInput value={F[M.STR.name]} onChange={(v)=>this.onFieldChange([M.STR.name],v)} /></td>
                        <td className='ap-input-caption'>Квартира/офис</td>
                        <td><EInput value={F[M.KVART.name]} onChange={(v)=>this.onFieldChange([M.KVART.name],v)} /></td>             
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.PINDEX.label}</td>
                        <td colSpan='3'><EInput value={F[M.PINDEX.name]} onChange={(v)=>this.onFieldChange([M.PINDEX.name],v)} /></td>
                    </tr>

                    {false && <React.Fragment><tr>
                        <td className='ap-input-caption'>{M.MESTO.label}</td>
                        <td colSpan='3'><EInput value={F[M.MESTO.name]} onChange={(v)=>this.onFieldChange([M.MESTO.name],v)} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.KM.label}</td>
                        <td><EInput value={F[M.KM.name]} onChange={(v)=>this.onFieldChange([M.KM.name],v)} /></td>
                        <td className='ap-input-caption'>{M.MGO.label}</td>
                        <td><EInput value={F[M.MGO.name]} onChange={(v)=>this.onFieldChange([M.MGO.name],v)} /></td>
                        <td className='ap-input-caption'>{M.MGT.label}</td>
                        <td><EInput value={F[M.MGT.name]} onChange={(v)=>this.onFieldChange([M.MGT.name],v)} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.DOP_SVED.label}</td>
                        <td colSpan='3'><EInput value={F[M.DOP_SVED.name]} onChange={(v)=>this.onFieldChange([M.DOP_SVED.name],v)} /></td>
                    </tr>
                    <tr>
                        <td className='ap-input-caption'>{M.SHIR.label}</td>
                        <td><EInput value={F[M.SHIR.name]} onChange={(v)=>this.onFieldChange([M.SHIR.name],v)} /></td>
                        <td className='ap-input-caption'>{M.DOLG.label}</td>
                        <td><EInput value={F[M.DOLG.name]} onChange={(v)=>this.onFieldChange([M.DOLG.name],v)} /></td>
                    </tr></React.Fragment>}
                    <tr>
                        <td><Button size="small" icon="plus" type="success" plain={true}
                                className="flex-parent mb18"
                                title='Применить' onClick={this.save}>Применить</Button></td>
                    </tr></React.Fragment>
                );

        return (
                <form>
                    {ADDRESS}
                </form>
        )
    }
} //

const mapStateToProps = (state) => ({sid : state.getIn(['general','user','sessionID'])});

export default connect(mapStateToProps)(AddressData)