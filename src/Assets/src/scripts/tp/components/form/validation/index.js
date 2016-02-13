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
    // Let's not start a debate on email regex. This is just for an example app!
    if (!isEmpty(value) && !/^[+-]?(?=.)(?:\d+,)*\d*(?:\.\d+)?$/i.test(value)) {
        return 'Зөвхөн тоо оруулана уу';
    }
}

export function required(value) {
    if (isEmpty(value)) {
        return 'Заавал бөглөх';
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

export default function validation(value, validationData){

    let rules = validationData.split('|');
    let errors = null;
    rules.map((rule) => {

        if(rule == 'required'){
            const error = required(value);
            if (error) {
                if(errors !== null)
                    errors = errors+", "+error;
                else
                    errors = error;
            }
        }
        else if(rule == 'email'){
            const error = email(value);
            if (error) {
                if(errors !== null)
                    errors = errors+", "+error;
                else
                    errors = error;
            }
        }
        else if(rule == 'link'){
            const error = link(value);
            if (error) {
                if(errors !== null)
                    errors = errors+", "+error;
                else
                    errors = error;
            }
        }
        else if(rule == 'number'){
            const error = number(value);
            if (error) {
                if(errors !== null)
                    errors = errors+", "+error;
                else
                    errors = error;
            }
        }else if(rule.indexOf('unique:') >= 0){

            const error = unique(rule, value);
            if (error) {
                if(errors !== null)
                    errors = errors+", "+error;
                else
                    errors = error;
            }

        }
    })

    return errors;


}