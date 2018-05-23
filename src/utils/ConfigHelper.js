import editorConfig from '../configs/editor.json';
/*
        {
            "name": "Zambia",
            "alpha-2": "ZM",
            "alpha-3": "ZMB",
            "country-code": 894,
            "iso_3166-2": "ISO 3166-2:ZM",
            "region": "Africa",
            "sub-region": "Eastern Africa",
            "region-code": "002",
            "sub-region-code": 14
        },
*/
import countryCodes from '../configs/countryCodes.json';

export const onlyTheseCountries = () => {
    return editorConfig.filterCountries ? editorConfig.filterCountries: [];
};

export const customFilterCountries = () => {
    const filterCountries = onlyTheseCountries() ;
    if (filterCountries.length > 0 ) {
        return flattenCountries().filter( 
            (country) => filterCountries.indexOf(country.alpha2) >= 0 
        );
    } else {
        return flattenCountries();
    }
};

export const flattenCountries = () => {
    return countryCodes.countries.country.map( (country) => {
        const {name, "alpha-2": alpha2 } = country;
        return {
            name,
            alpha2: alpha2.toLowerCase()
        };
    });
}