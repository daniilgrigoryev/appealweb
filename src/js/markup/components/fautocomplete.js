import React from 'react'
import {AutoComplete} from 'primereact/autocomplete';
import {getAc, getAcValue, getAcNoCache} from '../../services/acCacher.js'

class EAutocomplete extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSuggestions: null, // отображаемая панель с предлагаемыми вариантами
            visibleval: null, // видимое значение в интерфейсе (props.value - идентификатор записи, далее "ключ"; видимое значение - "текст")
            data: null // пары ключ->текст в виде массива [{props,value}]
        };

        this.dataWhere = null; // внешнее условия для отображаемого списка
        this.change = this.change.bind(this);
        this.select = this.select.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.suggestData = this.suggestData.bind(this);
        this.setVisibleVal = this.setVisibleVal.bind(this);
    }

    componentDidUpdate(prevData) { // обновление компонента
        const {value, dataWhere} = this.props;
        const {visibleval} = this.state;
        const prevDW = prevData.dataWhere;
        const dataWhereChanged = dataWhere && prevDW && !_.isEqual(dataWhere, prevDW); // флажок - внешние условие есть и оно изменилось
        
        if (dataWhereChanged) { // изменились внешние условия для отображаемого списка - сброс кэша
            this.setState({data: null, dataSuggestions: null, visibleval: ""});
        } else if (value != prevData.value) { // внешнее значение отсутствует или не менялось, но произошло изменение ключа
            if (value == '' || value == null){ // для пустоты - пустота
                this.setState({visibleval: ""});
            } else if (prevData.value=='' || prevData.value==null) { // если раньше была пустота, то нужно подгрузить значение из списка по ключу
                this.setVisibleVal(value);
            }
        }
    }

    componentDidMount() { // первичная загрузка автокомплита
        const {value,dbVisibleVal} = this.props;
        if (dbVisibleVal){
            this.setState({visibleval:dbVisibleVal}); // значение задано снаружи
        } else if (value){
            this.setVisibleVal(value); // если задан ключ - подгрузить видимое значение
        }
    }

    async setVisibleVal(value){ // установка по ключу видимого значения
        const {dataKey,dataWhere,dbVisibleVal} = this.props;
        const noWhere = _.isEmpty(dataWhere); // флажок отсутствия внешнего условия
        let visibleval = null; // переменная для видимого значения
        let {data} = this.state;
        if (noWhere) { // внешнего условия нет
            (!_.size(data)) && (data = await this.getDatas()); // получение списка из стейта или снаружи                        
            const queryLow = value.toLowerCase(); // перевод ключа в нижний регистр
            const ret = this.filter(null,data,queryLow); // фильтрация
            visibleval = _.first(ret); // первый (ожидаемо единственный) отфильтрованный элемент является искомым (пара {property,value})
        } else { // внешнее условие есть
            this.dataWhere = dataWhere; // сохранение в тело элемента условия из пропсов
            const result = await getAcNoCache(dataKey, JSON.stringify(dataWhere)); // получение списка снаружи с внешним условием
            const rows = result.data; // данные аякса содержат строки в data поле
            if (rows && !rows.error) { // если есть строки и нет ошибки
                visibleval = _.find(rows, x => x.property && x.property == value); // поиск пары {property,value}
            }
        }    
        visibleval = (visibleval && visibleval.value) || ''; // если текст не найден - попытка заменить его на прилетевший из бд плейсхолдер, иначе пустая строка
        this.setState({visibleval,data});    
    }

    async suggestData(event) { // формирование списка предпологаемых значений
        const value = event.query.toLowerCase(); // введенное пользователем значение, переведенное в нижний регистр
        const newState = {}; // дельта состояния 
        let list; // список предположений
        if (_.size(this.state.data)) { // данные уже есть
            list = this.filter(value); // фильтрация
        } else { // loading needs...
            newState.data = await this.getDatas();// подсос данных
            list = this.filter(value, newState.data)  // фильтрация
        }
        newState.dataSuggestions = list.map(x=>x.value); // вставка в дельту предполагаемых значений
        this.setState(newState); // наложение дельты
    }

    async getDatas() { // загрузка списка
        const {data, dataKey, datagetter, dataWhere, datapromise, readOnly, value, dbVisibleVal} = this.props;
        let d = []; // список            
        if (datagetter) { // задан синхронный геттер для данных
            d = datagetter();
        } else if (datapromise) { // задан асинхронный Promise геттер
            d = await datapromise();
        } else if (data) { // задан список как готовый объект
            d = data;
        } else if (dataKey){ // задан ключ-алиас для загрузки списка
            d = _.isEmpty(dataWhere) // проверка на наличие внешнего условия
                ? await getAc(dataKey) // загрузка без приключений
                : await getAcNoCache(dataKey, JSON.stringify(dataWhere)); // загрузка с внешним условием
        }
        d = d.data || d;       
        if (d && d.length && !d[0].hasOwnProperty('property')) { // если список не пустой и не имеет property поля в первом элементе - подозрение на обычный массив
            d = d.map(x=>({property:x, value:x})); // преобразование массива в {proprty,value} набор
        }
        if (value && dbVisibleVal){ // есть пришедшее снаружи значение
            const found = d.filter(x=>x.value==value).length; //  поиск наружных значений в текущем списке
            if (!found){ // если их нет
                d = [{value: +value,property:dbVisibleVal}, ...d]; // вкидывание пары вручную
            }
        }
        if(readOnly){ 
            d = [{property: '', value: '[отсутствует]'}, ...d]; // если автокомплит только для чтения - вкидываение в список значения 'отсутствует' для отображения безнадежной пустоты
        }
        return d;
    }

    filter(queryLowValue, data, queryKey = null) { // фильтрация списка
        const d = this.state.data || data; // забор списка из стейта или из аргументов
        if (!d || d.error) { // нет списка или он с ошибкой
            return []; // выход
        } else if (queryKey) { // есть и список есть
            const queryLow = queryKey.toLowerCase(); // перевод ключа в нижний регистр
            return d.filter((row) => row.property == queryLow); // возврат регистронезависимого поиска по ключу
        } else if (!queryLowValue){
            return d;
        }
        return d.filter((row)=>(row.value+'').toLowerCase().indexOf(queryLowValue) > -1); // озврат регистронезависимого поиска по значению
    }

    getKey(value) { // получение ключа по тексту
        const {data} = this.state; // пары ключ-значение
        if (data) { // если существуют - попытка поиска
            let K; // хранилка для текущей пары
            for (let key in data) { // перебор ключей
                if ((K = data[key]).value === value) { // если текст совпал
                    return K.property; // то возврат ключа
                }
            }
        }
        return null; // увы
    }

    change(event, cb = null) {
        const {value} = event;
        if (value == '' || value == '[отсутствует]') {
            const {onChange} = this.props;
            this.setState({visibleval: ''}, cb);
            onChange && (onChange(null));
        } else {
            this.setState({visibleval:value}, cb);
        }
    }

    select(event) {
        const {onChange, onSelect, name} = this.props;
        const cb = !onChange ? null : () => {
            const {value} = event;
            const key = this.getKey(value);
            onChange(key);
            onSelect && (onSelect({visibleval:value, key, name}));
        };
        this.change(event, cb);
    }

    render() {
        const {visibleval, dataSuggestions} = this.state;
        const {readOnly, disabled, placeholder} = this.props;
        const readonly = readOnly;
        const onChange = this.change;
        const onSelect = this.select;
        const suggestions = dataSuggestions;
        const completeMethod = this.suggestData;
        const dropdown = true;
        const value = visibleval || null;
        return <AutoComplete {...{value, suggestions, completeMethod, dropdown, disabled, readonly, onChange, onSelect, placeholder}} />
    } //
}

const FAutocomplete = function FAutocomplete(props) {
    const {input, meta} = props;
    return <EAutocomplete {...props} {...input} {...meta} reduxformfield="true" />
}  //

export {EAutocomplete, FAutocomplete};