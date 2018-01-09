import moment from 'moment';

export const displayDate = (date) => moment(date).format('MMMM D YYYY') ;

export const humanDate = (date) => moment(date).fromNow() ;