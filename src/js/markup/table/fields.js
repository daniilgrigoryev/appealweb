const gField = function(field,header,type,args={}){
	if (!field){
		throw 'no field found'
	} else if (!header){
		throw 'no header found'
	} else if (!type){
		throw 'no type found'
	}

    const {mask,selectKey,selectData,acKey,acData,checkBox,radio,hidden} = args;
    return {field,header,type, ...args};
}

const maskDigital = (rawValue)=>Array.from(rawValue||'').map(x=>/\d/);

export function num(field,header,args){
	args = args || {};
	if (!args.mask){ 
		args.mask = maskDigital; 
		args.maskguide = false;
	}
    return gField(field,header,'N',args);
}

export function str(field,header,args){
    return gField(field,header,'S',args);
}

export function tim(field,header,args){
    return gField(field,header,'T',args);
}

export function dat(field,header,args){
    return gField(field,header,'D',args);
}

export function d_t(field,header,args){
    return gField(field,header,'DT',args);
}

export function radStr(field,header,args){
    return gField(field,header,'SR',args);    
}

export function radNum(field,header,args){
    return gField(field,header,'NR',args);    
}

export function chk(field,header,args){
    return gField(field,header,'C',args);    
}


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

export function isNumber(f){
	return f && f.type.indexOf('N')>-1;
}

export function isString(f){
	return f && f.type.indexOf('S')>-1;
}

export function isPicker(f){
	return isTime(f) || isDate(f) || isDateTime(f);
}

export function isTime(f){
	return f && f.type=='T';
}

export function isDate(f){
	return f && f.type=='D';
}

export function isDateTime(f){
	return f && f.type=='DT';
}

export function isSelect(f){
	return f && (f.selectKey || f.selectData || f.selectGetter);
}

export function isAutocomplete(f){
	return f && (f.acKey || f.acData);
}

export function isRadiobutton(f){
	return f && f.type.indexOf('R')>-1 && f.radio && f.radio.length>1 && f.radio[0].property && f.radio[0].value; // field.radio:[{label,value}, {label,value}] // property - значение, value -интерфейс
}

export function isCheckbox(f){
	return f && f.type=='C' && f.checkBox && f.checkBox; // field.checkBox:true::boolean
}



