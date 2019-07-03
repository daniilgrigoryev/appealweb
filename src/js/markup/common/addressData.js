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
                ? (<div className="item item--full flex-parent--center-main">
                        {disabled ? null : 
                            <Button size="small" icon="plus" 
                                    plain={true} className="mx-auto my6 block" 
                                    title='Раскрыть' onClick={this.changeMode}>Редактировать</Button>
                        }
                    </div>
                )
                : (
                    <React.Fragment>
                    <div className="item item--full">
                        <small className="label">{M.REGION.label}</small>
                        <div className="value">
                            <EAutocomplete value={F[M.REGION.name]} key={F[M.REGION.name]} onChange={(val)=>this.onListChange(val,M.REGION.name)} dataKey={M.REGION.key} />
                        </div>
                    </div>
                    <div className="item item--full">
                        <small className="label">{M.RAYON.label}</small>
                        <div className="value">
                            <EAutocomplete value={F['rayon_id']} key={F['rayon_id']} onChange={(val)=>this.onListChange(val,'rayon_id')} dataWhere={_.pick(F, [M.REGION.name])} dataKey={M.RAYON.key} />
                        </div>
                    </div>
                    <div className="item item--full">
                        <small className="label">{M.NPUNKT.label}</small>
                        <div className="value">
                            <EAutocomplete value={F['city_id']} key={F['city_id']} onChange={(val)=>this.onListChange(val,'city_id')} dataWhere={_.pick(F, [M.REGION.name, 'rayon_id'])} dataKey={M.NPUNKT.key}  />
                        </div>
                    </div>
                    
                
                    <div className="item" style={{gridColumn: '1 / span 3'}}>
                        <small className="label">{M.STREET.label}</small>
                        <div className="value">
                            <EAutocomplete value={F['street_id']} key={F['street_id']} onChange={(val)=>this.onListChange(val,'street_id')} dataWhere={_.pick(F, [M.REGION.name,'rayon_id','city_id'])} dataKey={M.STREET.key}  />
                        </div>
                    </div>
                    
                    <div className="item item--flow" style={{gridColumn: 'auto / 5'}}>
                        <small className="label">{M.PINDEX.label}</small>
                        <div className="value">
                            <EInput value={F[M.PINDEX.name]} onChange={(v)=>this.onFieldChange([M.PINDEX.name],v)} />
                        </div>
                    </div>
                    <div className="item" style={{gridColumn: 'auto / span 1'}}>
                        <small className="label">{M.DOM.label}</small>
                        <div className="value">
                            <EInput value={F[M.DOM.name]} onChange={(v)=>this.onFieldChange([M.DOM.name],v)}/>
                        </div>
                    </div>
                    <div className="item item--flow" style={{gridColumn: 'auto / span 1'}}>
                        <small className="label">{M.KORPUS.label}</small>
                        <div className="value">
                            <EInput value={F[M.KORPUS.name]} onChange={(v)=>this.onFieldChange([M.KORPUS.name],v)} />
                        </div>
                    </div>
                    <div className="item item--flow" style={{gridColumn: 'auto / span 1'}}>
                        <small className="label">{M.STR.label}</small>
                        <div className="value">
                            <EInput value={F[M.STR.name]} onChange={(v)=>this.onFieldChange([M.STR.name],v)} />
                        </div>
                    </div>
                    <div className="item item--flow" style={{gridColumn: 'auto / span 1'}}>
                        <small className="label">Квартира/офис</small>
                        <div className="value">
                            <EInput value={F[M.KVART.name]} onChange={(v)=>this.onFieldChange([M.KVART.name],v)} />
                        </div>
                    </div>

                    {false && 
                    <React.Fragment>
                    <div className="item">
                        <small className="label">{M.MESTO.label}</small>
                        <div className="value">
                            <EInput value={F[M.MESTO.name]} onChange={(v)=>this.onFieldChange([M.MESTO.name],v)} />
                        </div>
                    </div>
                    <div className="item">
                        <small className="label">{M.KM.label}</small>
                        <div className="value">
                            <EInput value={F[M.KM.name]} onChange={(v)=>this.onFieldChange([M.KM.name],v)} />
                        </div>
                    </div>
                    <div className="item">
                        <small className="label">{M.MGO.label}</small>
                        <div className="value">
                            <EInput value={F[M.MGO.name]} onChange={(v)=>this.onFieldChange([M.MGO.name],v)} />
                        </div>
                    </div>
                    <div className="item">
                        <small className="label">{M.MGT.label}</small>
                        <div className="value">
                            <EInput value={F[M.MGT.name]} onChange={(v)=>this.onFieldChange([M.MGT.name],v)} />
                        </div>
                    </div>
                    <div className="item">
                        <small className="label">{M.DOP_SVED.label}</small>
                        <div className="value">
                            <EInput value={F[M.DOP_SVED.name]} onChange={(v)=>this.onFieldChange([M.DOP_SVED.name],v)} />
                        </div>
                    </div>
                    <div className="item">
                        <small className="label">{M.SHIR.label}</small>
                        <div className="value">
                            <EInput value={F[M.SHIR.name]} onChange={(v)=>this.onFieldChange([M.SHIR.name],v)} />
                        </div>
                    </div>
                    <div className="item">
                        <small className="label">{M.DOLG.label}</small>
                        <div className="value">
                            <EInput value={F[M.DOLG.name]} onChange={(v)=>this.onFieldChange([M.DOLG.name],v)} />
                        </div>
                    </div>
 
                    </React.Fragment>}
                        <div className="item item--right">
                            <div style={{'grid-column': 'span 2'}}>
                                <div className="flex-parent flex-parent--end-main mb12">
                                    <Button size="small" icon="plus" type="success" plain={true} className="flex-parent" title='Применить' onClick={this.save}>Применить</Button>
                                </div>
                            </div>
                        </div>
                    </React.Fragment>
                );

        return (
            <div scrollanchor='adressData'>
                <Card className="box-card sectionCard" header={
                <div className='headline'>
                    <h3>Адрес</h3>
                </div>
                }>
                <form className="form">
                    <div className="form-container">
                        <div className="wrap">
                            {ADDRESS}
                        </div>
                    </div>
                </form>
                </Card>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({sid : state.getIn(['general','user','sessionID'])});

export default connect(mapStateToProps)(AddressData)