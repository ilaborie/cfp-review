import {AppState} from './AppState';
import {Talk} from './Talk';

export interface Sort<T> {
    (left: T, right: T): number;
}

export const reverse = <T>(sort: Sort<T>): Sort<T> =>
    (left: T, right: T) => sort(left, right) * -1;

export const noSort: Sort<any> = (a: any, b: any) => 0;

export const sortByAttr = <T, A extends keyof T>(attr: A, transform: (a: T[A]) => number): Sort<T> =>
    (left: T, right: T) => transform(left[attr]) - transform(right[attr]);


// Sort Talk

export const createSorting = (state: AppState): Sort<Talk> => {
    const {attr, direction} = state.sorting;
    let result = noSort;

    switch (attr) {
        case 'added':
            result = sortByAttr<Talk, 'added'>('added', l => l);
            break;
        case 'mean':
            result = sortByAttr<Talk, 'mean'>('mean', l => l === null ? -1 : l);
            break;
        case 'difficulty':
            result = sortByAttr<Talk, 'difficulty'>('difficulty', l => l);
            break;
        case 'state':
            result = (left: Talk, right: Talk) => left.state.localeCompare(right.state);
            break;
        case 'name':
            result = (left: Talk, right: Talk) => left.name.localeCompare(right.name);
            break;
        case 'speaker':
            result = (left: Talk, right: Talk) => left.speaker.lastname.localeCompare(right.speaker.lastname);
            break;
        case 'followers':
            result = (left: Talk, right: Talk) => (left.speaker.twitterCount||0) - (right.speaker.twitterCount||0);
            break;
        case 'theme':
            result = (left: Talk, right: Talk) => left.trackLabel.localeCompare(right.trackLabel);
            break;
        case 'format':
            result = sortByAttr<Talk, 'format'>('format', l => l);
            break;
    }

    if (direction === 'desc') {
        result = reverse(result);
    }

    return result;
};

