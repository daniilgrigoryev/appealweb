import * as org from './organizationsForm.js'

export const required = value => (value || typeof value === 'number' ? undefined : 'Необходимо значение');

export const maxLength = max => value =>  value && value.length > max ? `Ожидается длина значения не более ${max} символов` : undefined
export const minLength = min => value =>  value && value.length < min ? `жидается длина значения не менее ${min} символов` : undefined

export const number = value =>  value && isNaN(Number(value)) ? 'Ожидается число' : undefined

export const minValue = min => value =>  value && value < min ? `Минимальное допустимое значение: ${min}` : undefined
export const maxValue = max => value =>  value && value > max ? `Максимально допустимое значение: ${max}` : undefined

export const email = value =>  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Некорректный адрес'
    : undefined

export {org}