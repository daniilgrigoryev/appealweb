import React from 'react'
import ReactDOM from 'react-dom'
import { Portal } from 'react-portal';
import {Tooltip} from 'element-react'
import positions from 'positions'

export default function withValidators(WrappedComponent,args={}) {
  
  return class extends React.Component {

    constructor(props){
    	super(props);
    	
    	this.ref = null;
		this.setRef = this.setRef.bind(this);
		this.setRefTtp = this.setRefTtp.bind(this);

		this.refOwner = null;
		this.refTtp = null;

		this.touched = false;
		this.newProps = null;
    }


    fillValidatedProps(){
    	let newProps = Object.assign({},this.props);
		const {meta,validate,validate_args} = this.props;
		const {forceValidate} = args;
		if (forceValidate){
		//	newProps.onValidate = ()=> this.forceUpdate();
		}

		if (!meta && validate && validate.length){
			let error = void 0;
			const outerProps = validate_args || {};
			const V = validate;
			for (let i=0;i<V.length;i++){
				error = V[i](this.props.value, outerProps);
				if (error){
					break;
				}
			}

			if (error){
				newProps = Object.assign(newProps,{meta: {error}});
			}
		}
		this.newProps = newProps;
    }

	componentDidMount__old(){
		if (!this.newProps.meta){
			return;
		}

		const {warning,error} = this.newProps.meta;
		if (error || warning){
			setTimeout(()=>this.ref.setState({showPopper: true}),0);
		}
	}

	setRef(x){
		this.ref=x;
	}

	setRefTtp(x){ 
		this.refTtp = x;
		if (!x){
			return;
		}

		const TRG = ReactDOM.findDOMNode(this.ref);
        const s = positions(x, 'top left', TRG, 'top right');
		const st = {
        	display: 'inline-block',
        	position: 'absolute'
        }
        
        const newTop = s.top + (TRG.clientHeight - x.clientHeight)/3;
        const newLeft = s.left + 4;
		Object.assign(x.style,st,{ top: newTop+'px', left: newLeft+'px'});
	}

	render() {
		this.fillValidatedProps();
		let TTP = null;
		const COMP = <WrappedComponent ref={this.setRef} key='TTP1'  {...this.props} />;
		//
    	if (this.newProps.meta){
    		const {warning,error,title,touched} = this.newProps.meta;
			const content = error || warning || title || false;
			let cl = 'tooltipWrap ';
			if (error){
				cl += 'validationErr';
			} else if (warning){
				cl += 'validationWarn'; 
			} else if (touched) {
				cl += 'validationOk';
			}

    		if (content){
    			TTP = (<Portal key='TTP2'>
    						<div ref={this.setRefTtp} className={cl} title={content} ></div>
    				   </Portal>);
    		}
    	}
    	this.refOwner = COMP;
		this.refTtp = TTP;
    	return [COMP,TTP];    	
    } //

    render__old() {
    	if (!this.props.meta){
    		return	<WrappedComponent  {...this.props} />;
		} //

    	const {warning,error,title,touched} = this.props.meta;
		const content = error || warning || title || false;

		if (!content){
			return	<WrappedComponent  {...this.props} />;
		} //

		let cl = 'item';
		if (error){
			cl = 'validationErr';
		} else if (warning){
			cl = 'validationWarn'; 
		} else if (touched) {
			cl = 'validationOk';
		}
      	return (<Tooltip ref={this.setRef} className={cl} effect="dark" content={content} placement="right">
					<WrappedComponent  {...this.newProps} />
				</Tooltip>);
    } //
  }; 
}