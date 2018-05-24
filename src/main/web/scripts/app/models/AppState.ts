import {List} from 'immutable'

import {Talk} from './Talk';

export interface AppState {
    token: string,
    me: string,
    loading: boolean;
    rawTalks: List<Talk>;

    filtering: {
        [index: string]: string;
    };

    sorting: {
        [index: string]: string;
    };

    error?: any;
}
