function getGeneral(state){
	return state.get('general')
}

export function getUser(state){
	return getGeneral(state).get('user')
}

export function getSessionId(state){
	return getGeneral(state).getIn(['user','sessionID'])
}

export function getSystem(state){
	return state.getIn(['general','system'])
}
