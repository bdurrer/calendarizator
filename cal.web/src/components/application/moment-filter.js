/*	eslint no-param-reassign: 0	*/
import moment from 'moment/moment';

function momentFilter() {
    return function (value, format) {
        if (typeof value === 'undefined' || value === null) {
            return '';
        }
        if (!isNaN(parseFloat(value)) && isFinite(value)) {
            value = new Date(parseInt(value, 10));
        }
        if (typeof format === 'undefined' || format === null || format === '') {
            return moment(value).format();
        }
        return moment(value).format(format);
    };
}

export default [
    momentFilter
];
