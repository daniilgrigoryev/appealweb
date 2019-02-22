import React from 'react'

export default function transform(Element,props){
	return React.memo(function(Element,props){
		const {input,meta} = props;
		return <Element {...props} {...input} {...meta} />
	}) //
}
