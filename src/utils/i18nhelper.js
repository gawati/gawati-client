import uilang from '../configs/uiLangs.json';
//import { I18n, Trans } from 'react-i18next';
import {t} from 'i18next';

export const T = (key) => t(key) ;

export const defaultUiLang = () =>
    uilang.langs.find(lang => lang.default === true);

export const getLangs = () => uilang.langs ;