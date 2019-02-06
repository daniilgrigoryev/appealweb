export const AUTOCOMPLETE_REQUEST = 'AUTOCOMPLETE_REQUEST'
export const AUTOCOMPLETE_LOADED  = 'AUTOCOMPLETE_LOADED'

export const MASK_REQUEST = 'MASK_REQUEST'
export const MASK_LOADED  = 'MASK_LOADED'

export function acRequest(key, query){
	return {type: AUTOCOMPLETE_REQUEST, key, query}
}

export function acLoaded(key, data){
	return {type: AUTOCOMPLETE_LOADED, key, data}
}