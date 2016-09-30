import Moment from 'moment'

export function getDate(date) {

    if (typeof date === 'string' || date instanceof String) {

        return date;
    } else {

        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("YYYY-MM-DD");
        } else {
            return Moment(date * 1).format("YYYY-MM-DD");
        }
    }

}
export function getDateTime(date) {
    if (typeof date === 'string' || date instanceof String) {

        return date;
    } else  {
        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("YYYY-MM-DD HH:mm");
        } else {
            return Moment(date * 1).format("YYYY-MM-DD HH:mm");
        }
    }

}
export function getTime(date) {
    if (typeof date === 'string' || date instanceof String) {

        return date;
    } else {
        if ((new Date(date)).toString() !== "Invalid Date") {
            return Moment(date).format("HH:mm");
        } else {
            return Moment(date * 1).format("HH:mm");
        }
    }

}