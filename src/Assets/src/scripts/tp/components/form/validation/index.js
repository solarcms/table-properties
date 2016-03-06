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

export function password(value) {

    if (!isEmpty(value) && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/i.test(value)) {
        return 'Нууц үг том үсэг, жижиг үсэг, тоо эсвэл тусгай тэмдэгт агуулсан байх ёстой';
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
export function passConfirm(value, value2) {
    if (isEmpty(value)) {
        return 'Заавал бөглөх';
    } else if(value != value2){
        return 'Баталгаажуулалт таарсангүй';
    }
}


export default function validation(value, validationData, passConfirmValue){
    let errors = null;
    if(passConfirmValue){
        const error = passConfirm(value, passConfirmValue);
        if (error) {
            if(errors !== null)
                errors = errors+", "+error;
            else
                errors = error;
        }
    } else {
        let rules = validationData.split('|');

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
            }
            else if(rule == 'password'){
                const error = password(value);
                if (error) {
                    if(errors !== null)
                        errors = errors+", "+error;
                    else
                        errors = error;
                }
            }
        })

    }


    return errors;


}