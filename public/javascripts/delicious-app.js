import '../sass/style.scss';

import { $, $$ } from './modules/bling';

import autocomplete from './modules/autocomplete'; 

import typeAhead from './modules/typeAhead'; 

import makeMap from './modules/map'; 

// functions

autocomplete( $('#address'), $('#lat'), $('#lng')); 

typeAhead( $('.search') ); 

makeMap( $('#map') ); 