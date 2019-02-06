export const validateOrgFrom = (field)=>(val,props)=>{
	const F = field, V = val, P = props;

	const emptyName = !P.name;
	const emptyNum  = !P.num;
	const emptyDate = !P.date;

	if (emptyName && emptyNum && emptyDate){
		return void 0;
	}

	if (emptyName && F=='name'){
		return 'Поле должно быть заполнено'
	} else if (emptyNum && F=='num'){
		return 'Поле должно быть заполнено'
	} else if (emptyDate && F=='date'){
		return 'Поле должно быть заполнено'
	}
	return void 0;
}

export const validateOrgCtrl = (field)=>(val,props)=>{
	const F = field, V = val, P = props;

	const emptyName = !P.name;
	const emptyNum  = !P.num;
	const emptyDate = !P.date;
    const emptyCtrlDate = !P.control_date;

	if (emptyName && emptyNum && emptyDate && emptyCtrlDate){
		return void 0;
	}

	if (emptyName && F=='name'){
		return 'Поле должно быть заполнено'
	} else if (emptyNum && F=='num'){
		return 'Поле должно быть заполнено'
	} else if (emptyDate && F=='date'){
		return 'Поле должно быть заполнено'
	} else if (emptyCtrlDate && F=='control_date'){
		return 'Поле должно быть заполнено'
	}
	return void 0;
}