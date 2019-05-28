import React from 'react'
import moment from 'moment'
import withValidators from './tooltipper.js'
import {TimePicker, DatePicker} from 'element-react'
import MaskedInput from 'react-text-mask'

// Element component

const DATE_FORMAT = 'YYYY-MM-DD"T"HH:mm:ss"Z"';

class APicker extends React.Component {
    render() {
        const {timepicker, datepicker, datetimepicker, onChange, reduxformfield} = this.props;
        let value = reduxformfield ? this.props.input.value : this.props.value;
        value = value || null;

        if (typeof value == 'string') {
            value = moment(value,DATE_FORMAT).toDate();
        }

        const customChanger = (inpVal) => {
            let newVal = !inpVal ?  null :moment(inpVal).format(DATE_FORMAT);
            let changer = null;
            if (reduxformfield) {
                this.props.input.onChange(newVal);
            } else if (changer = this.props.onChange) {
                changer(newVal);
            } else if (changer = this.props.onValidate) {
                changer(newVal);
            }
        }

        const datePickerFormatToday = () => {
            requestAnimationFrame(() => {
                let today = new Date().getDate().toString(),
                    pickerEl = 'el-picker-panel',
                    todayEl = 'today',
                    cfg = {subtree: true, attributes: true},
                    observer = new MutationObserver((mutations) => {
                        mutations.forEach(function (mutation) {
                            let t = mutation.target;
                            if (!t.classList.contains(todayEl)) return;
                            observer.disconnect();
                            t.textContent = today;
                            requestAnimationFrame(() => observer.observe(document.querySelector(`.${pickerEl}`), cfg))
                        });
                    });

                if (!!document.querySelector(`.${pickerEl} .${todayEl}`)) {
                    document.querySelector(`.${pickerEl} .${todayEl}`).textContent = today;
                }

                observer.observe(document.querySelector(`.${pickerEl}`), cfg);
            })
        };

        const p = Object.assign({}, this.props);
        delete p.onChange;
        p.isDisabled = p.disabled;
        p.isReadonly = p.disabled;

        if (timepicker) {
            return <TimePicker {...p} value={value} onChange={customChanger}/>;
        } else { //
            const isShowTime = !!datetimepicker;
            return <DatePicker {...p} isShowTime={isShowTime} value={value} onFocus={datePickerFormatToday} onChange={customChanger}/>
        } //
    } //
}

const EPicker = withValidators(APicker, {forceValidate: true});

// redux Forrm component
const FPicker = (props) => {
    const {input, label, type, meta: {touched, error}} = props;
    const newProps = Object.assign({}, props);
    //delete newProps.meta;
    return <EPicker {...newProps} reduxformfield="true"/>
} //

export {EPicker, FPicker};
