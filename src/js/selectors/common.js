function getGeneral(state){
	return state.get('general')
}

export function getUser(state){
	return getGeneral(state).get('user')
}

export function getMessages(state){
	return getGeneral(state).get('messagesQueue')
}

export function getSessionId(state){
	return getGeneral(state).getIn(['user','sessionID'])
}
