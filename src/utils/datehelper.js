import moment from 'moment';

export const displayDate = (date) => moment(date).format('MMMM D YYYY') ;

export const displayXmlDateTime = (dateTime) => {
  let date = moment(dateTime);
  let datePart = date.utc().format('MMMM D YYYY');
  let timePart = date.utc().format('HH:mm');
  return `${datePart} at ${timePart}`;
};


export const humanDate = (date) => moment(date).fromNow() ;

export const iriDate = (date) => moment(date).format("YYYY-MM-DD");

/**
 * Checks if passed Date object is a valid date
 * @param {Date} date 
 */
export const isValidDate = (date) => {
    if ( Object.prototype.toString.call(date) === "[object Date]" ) {
        // it is a date
        if ( isNaN( date.getTime() ) ) {  // d.valueOf() could also work
          return false;
        }
        else {
          return true;
        }
      }
      else {
        return false;
      }
};