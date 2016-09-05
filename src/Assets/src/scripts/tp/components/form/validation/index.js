import {checkUnique} from '../../../api/index'
const isEmpty = value => value === undefined || value === null || value === '';
export function email(value) {
    // Let's not start a debate on email regex. This is just for an example app!
    if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        return 'И-мэйл оруулана уу';
    }
}
export function link(value) {
    // Let's not start a debate on email regex. This is just for an example app!
    if (!isEmpty(value) && !/^(ftp|http|https):\/\/[^ "]+$/i.test(value)) {
        return 'Буруу хаяг байна';
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

export function regex_get(custom_hex, value) {

    var patt = null;

    let lastcharecter = custom_hex.substr(custom_hex.length - 1);
    if(lastcharecter != '/'){
        custom_hex = custom_hex.substring(0, custom_hex.length - 1);


    }


    custom_hex = custom_hex.replace("/", '');
    custom_hex = custom_hex.replace("/", '');

    patt = new RegExp(custom_hex);


    if (!patt.test(value)) {
        return 'Мэдээллийг зөв форматаар бөглөнө үү';
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
        return 'Зөвхөн тоо оруулна уу';
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
                return 'Таарсангүй';
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
    // console.log(validationData, 'validationData')
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
            } else if((rule.indexOf('regex') !== -1)){
                var regex = rule.replace('regex:', '')
                const error = regex_get(regex, value);
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