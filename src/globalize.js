import momentLocalizer from 'react-widgets-moment';
import Moment from 'moment';

export const init = () => {
    Moment.locale('en');
    Moment.locale('fr');
    Moment.locale('pt');
    Moment.locale('es');
    momentLocalizer();
};

init();