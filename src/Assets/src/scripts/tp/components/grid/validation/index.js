import {checkUnique} from '../../../api/index'
const isEmpty = value => value === undefined || value === null || value === '';
export function email(value) {
    // Let's not start a debate on email regex. This is just for an example app!
    if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return 'Invalid email address';
    }
}
export function link(value) {
    // Let's not start a debate on email regex. This is just for an example app!
    if (!isEmpty(value) && !/^(ftp|http|https):\/\/[^ "]+$/i.test(value)) {
        return 'Invalid url address';
    }
}
export function number(value) {

    if (!isEmpty(value) && !/^[+-]?(?=.)(?:\d+,)*\d*(?:\.\d+)?$/i.test(value)) {
        return false;
    }
    else {
        return true;
    }
}

export function required(value) {

    if (isEmpty(value)) {
        return false;
    } else {
        return true;
    }
}

export function minLength(min) {
    return value => {
        if (!isEmpty(value) && value.length < min) {
            return `Must be at least ${min} characters`;
        }
    };
}

export function maxLength(max) {
    return value => {
        if (!isEmpty(value) && value.length > max) {
            return `Must be no more than ${max} characters`;
        }
    };
}

export function integer(value) {
    if (!Number.isInteger(Number(value))) {
        return 'Must be an integer';
    }
}

export function oneOf(enumeration) {
    return value => {
        if (!~enumeration.indexOf(value)) {
            return `Must be one of: ${enumeration.join(', ')}`;
        }
    };
}

export function match(field) {
    return (value, data) => {
        if (data) {
            if (value !== data[field]) {
                return 'Do not match';
            }
        }
    };
}

export function unique(rule, value) {

        let unique = rule.split(':');
        let table_colummn = unique[1].split(',');
        let return_error = '';

        checkUnique(table_colummn[0], table_colummn[1], value).then((count)=>{
            if(count >= 1){
                console.log(count)
                return_error = 'Өгөдөл давцаж байна'
            }
        })

    return return_error;

}

export default function validationGrid(validationData, value, callback){



    let rules = validationData.split('|');

    let errors = [];

    if(callback){
        rules.map((rule) => {

            if(rule == 'required'){
                errors.push(required(value));

            } else if(rule == 'number'){
                errors.push(number(value));

            }

        })
        let error_not_found = true;
        errors.map(error =>{
            if(error === false)
                error_not_found = false
        })


        callback(error_not_found)
    } else {
        rules.map((rule) => {

            if(rule == 'required'){
                errors.push(required(value));

            } else if(rule == 'number'){
                errors.push(number(value));

            }

        })
        let error_not_found = true;
        errors.map(error =>{
            if(error === false)
                error_not_found = false
        })

        return error_not_found;
    }




}