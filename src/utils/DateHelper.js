import moment from 'moment';
import {displayDateFormat, displayDateTimeFormat} from '../constants';

export const displayDate = (date) => moment(date).format(displayDateFormat()) ;

export const displayXmlDateTime = (dateTime) => {
  let date = moment(dateTime);
  const dispDateTimeFormat = displayDateTimeFormat();
  let datePart = date.utc().format(dispDateTimeFormat.date);
  let timePart = date.utc().format(dispDateTimeFormat.time);
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

/**
 * Important! Use only when sending from Browser to Server
 * OR when setting dates on a date widget. 
 * Set the time of current date to 12:00:00 to avoid 
 * UTC <-> local conversion issues.
 * Convert the date to UTC but retain the same date using the offset.
 * JS does offset in reverse so multiply by -1
 */
export const fixTime = (jsDate) => {
  const offset = jsDate.getTimezoneOffset();
  const datePart = moment(jsDate).utcOffset(offset * -1).format('YYYY-MM-DD');
  const dateTime = datePart + ' 12:00:00 Z';
  const newDate = moment(dateTime, "YYYY-MM-DD HH:mm:ss Z", true).toDate();
  return newDate;
}
