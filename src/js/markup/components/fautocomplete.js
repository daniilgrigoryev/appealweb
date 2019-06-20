import React from 'react'
import withValidators from './tooltipper.js'
import {AutoComplete} from 'primereact/autocomplete';
import {getAc, getAcValue, getAcNoCache} from '../../services/acCacher.js'

class EAutocomplete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSuggestions: null,
            value: null,
            data: null,
            dataKeyed: null
        };

        this.dataWhere = null;

        this.change = this.change.bind(this);
        this.select = this.select.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.suggestData = this.suggestData.bind(this);
        this.blur = this.blur.bind(this);
    }

    componentDidUpdate(prevData) {
        const {value, dataWhere} = this.props;
        const {dataKeyed} = this.state;
 
        if(_.size(dataKeyed)){ // фикс для кривых апдейтов
            const valueOuter =  _.chain(dataKeyed).filter(x=>x.property===value).first().get('value').value();
            if (valueOuter!=this.state.value){
                this.setState({value: valueOuter});
                return;
            }
        }
        
        const prevDW = prevData.dataWhere;
        const dataWhereChanged = dataWhere && prevDW && !_.isEqual(dataWhere, prevDW);
        if (dataWhereChanged) {
            this.setState({data: null, dataKeyed: null, dataSuggestions: null, value: ""});
        } else if (value != prevData.value && (value == '' || value == null)) {
            if (window.lolkek) {
                    setTimeout(()=>{
                        window.lolkek && (window.lolkek = null);
                    },1000)
                    this.setState({data: null, dataKeyed: null, value: ""});
                }
            }

    }

    componentDidMount() {
        const {acKey, dataKey, value, dataWhere, stoppe} = this.props;
        //value && getAcValue(acKey||dataKey,value).then((value)=>this.setState({value})); // prop value was passed
        if (value) {
            const key = acKey || dataKey;
            const hasWhere = !_.isEmpty(dataWhere);
            if (!hasWhere) {
                if (key) { // quick way
                    getAcValue(key, value).then((value) => {
                        this.setState({value});
                    });
                } else { // long hard way
                    this.getDatas().then(x => {
                        
                        const queryLow = value.toLowerCase();
                        const ret = this.filter(null, x.data, x.dataKeyed, queryLow);
                        const first = _.first(ret);
                        if (first) {
                            this.setState({value: first});
                        }
                    });
                }
            } else {
                this.dataWhere = dataWhere;
                getAcNoCache(key, JSON.stringify(dataWhere)).then((result) => {
                    const rows = result.data;
                    let findVal;
                    if (rows && !rows.error) {
                        findVal = _.find(rows, x => x.property && x.property == value);
                    }
                    const val = findVal ? findVal.value : 0;
                    this.setState({value: val});
                });
            }
        }
    }

    async suggestData(event) {
        const value = event.query.toLowerCase();
        if (_.size(this.state.data)) { // ac has data
            return this.filter(value);
        } // else - loading needs...
        const d = await this.getDatas();
        return this.filter(value, d.data, d.dataKeyed)
    }

    async getDatas() {
        let d = null;

        { // search list source
            const {data, acKey, dataKey, datagetter, dataWhere, datapromise, readOnly} = this.props;
            
            if (datagetter) {
                d = datagetter();
            } else if (datapromise) {
                d = await datapromise();
            } else if (data) {
                d = data;
            } else {
                const hasWhere = !_.isEmpty(dataWhere);
                const key = acKey || dataKey;
                d = hasWhere
                        ? await getAcNoCache(key, JSON.stringify(dataWhere))
                        : await getAc(key); // докинуть дополнительные параметры (из пропсов)  
            }
            d = d.data ? d.data : d;

            if (readOnly && !d.find(x => x.value === '[отсутствует]')) {
                d = [{property: '', value: '[отсутствует]'}, ...d];
            }
        }

        let dataKeyed = d;
        let dataLabels = d;
        if (d && d.length) {

            // warning
            if (typeof d[0].property === 'string' && d[0].value) {
                dataLabels = d.map(x => x.value);
            } else {
                dataKeyed = null; // d.map(x=>({property: x, value: x}));
            }
        }
        return {data: dataLabels, dataKeyed};
    }

    filter(queryLow, data, dataKeyed, queryKey = null) {
        const d = this.state.data || data;
        if (!d || d.error) {
            return [];
        }

        if (queryKey) {
            const first = _.first(dataKeyed);
            const queryLow = queryKey.toLowerCase();
            return (first.property == first.value) // noKey
                    ? d.filter((row) => row.toLowerCase().indexOf(queryLow) > -1)
                    : dataKeyed.filter((row) => row.property == queryLow).map(x => x.value);
        }

        const dataSuggestions = d.filter((row) => row.toLowerCase().indexOf(queryLow) > -1);
        const dState = {dataSuggestions};

        if (data && data.length) {
            dState.data = data;
            (dataKeyed && dataKeyed.length) && (dState.dataKeyed = dataKeyed);
        }
        this.setState(dState);
        return dataSuggestions;
    }

    getKey(value) {
        const {data, dataKeyed} = this.state;

        if (!data) {
            return null;
        } else if (!dataKeyed) {
            return value;
        }

        let K;
        for (let key in dataKeyed) {
            if ((K = dataKeyed[key]).value == value) {
                return K.property;
            }
        }
        return null;
    }

    blur(event) {
        const value = event.target.value.toLowerCase();
        const {data} = this.state;

        if (value && data) {
            let match = data.filter(function (row) {
                return row.toLowerCase().indexOf(value) > -1;
            }).length;
            if (!match) {
                this.setState({value: ''});
            }
        } else {
            setTimeout(() => {
                this.blur(event);
            }, 200);
        }
    }
    change(event, cb = null) {
        const {value} = event;

        if (value == '' || value == '[отсутствует]') {
            const {onChange} = this.props;
            this.setState({value: ''}, cb);
            onChange && (onChange(null));
        } else {
            this.setState({value}, cb);
    }
    }

    select(event) {
        const {onChange, onSelect, name} = this.props;
        const cb = !onChange ? null : () => {
            const {value} = event;
            const key = this.getKey(value);
            onChange(key);
            onSelect && (onSelect({value, key, name}));
        };
        this.change(event, cb);
    }

    render() {
        const {value, dataSuggestions} = this.state;
        const {readOnly, disabled} = this.props;
        const readonly = readOnly;
        const onChange = this.change;
        const onSelect = this.select;
        const onClick = this.click;
        const onBlur = () => this.blur(window.event);
        const suggestions = dataSuggestions;
        const completeMethod = this.suggestData;
        const dropdown = true;

        return <AutoComplete {...{value, suggestions, completeMethod, dropdown, disabled, readonly, onChange, onSelect, onClick, onBlur}} />
        } //
    }

//const EAutocomplete = withValidators(AAutocomplete);

// redux Form component
    const FAutocomplete = function FAutocomplete(props) {
        const {input, meta} = props;
        return <EAutocomplete {...props} {...input} {...meta} reduxformfield="true" />
    }  //

    export {EAutocomplete, FAutocomplete};