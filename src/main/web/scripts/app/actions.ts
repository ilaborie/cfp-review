import {List} from 'immutable';

import {Action, createAction} from '../frwk/actions';

import {AppState} from './models/AppState';
import {JsonTalk, jsonTalkMapper} from './models/Talk';
import {Rate} from './models/Rate';

interface GetTalks {
    me: string;
    talks: JsonTalk[];
}

export const fetchTalksAction = createAction((state: AppState) =>
    fetch('api/talks', {headers: {Token: state.token}})
        .then(response => response.json())
        .then((json: GetTalks) => {
            const {me, talks: jsonTalks} = json;
            const talks = jsonTalks.map(talk => jsonTalkMapper(talk, me));
            return {...state, loading: false, me, rawTalks: List(talks)};
        })
        .catch(error => ({...state, loading: false, error})));


export class SetTokenAction implements Action<string, AppState> {
    shouldRender = true;

    constructor(readonly payload: string) {
    }

    apply(state: AppState): Promise<AppState> {
        const newState: AppState = {
            ...state,
            loading: true,
            token: this.payload,
            rawTalks: List()
        };
        return Promise.resolve(newState);
    }

}

export interface AttrValue {
    attr: string;
    value: string;
}

export class SetFilterAction implements Action<AttrValue, AppState> {
    shouldRender = true;
    constructor(readonly payload: AttrValue) {
    }

    apply(state: AppState): Promise<AppState> {
        const {attr, value} = this.payload;
        const filtering = {...state.filtering};
        filtering[attr] = value;
        return Promise.resolve({...state, filtering});
    }
}

export class SetSortingAction implements Action<AttrValue, AppState> {
    shouldRender = true;
    constructor(readonly payload: AttrValue) {
    }

    apply(state: AppState): Promise<AppState> {
        const {attr, value} = this.payload;
        const sorting = {...state.sorting};
        sorting[attr] = value;
        return Promise.resolve({...state, sorting});
    }
}

export interface VoteActionPayload {
    id: string;
    rate: Rate;
}

export class VoteAction implements Action<VoteActionPayload, AppState> {
    shouldRender = true;
    constructor(readonly payload: VoteActionPayload) {
    }

    apply(state: AppState): Promise<AppState> {
        const {id, rate} = this.payload;
        const talkId = parseInt(id, 10);
        const talk = state.rawTalks.find(talk => !!talk && talk.id === talkId);
        const lastVote: Rate | null = (!!talk && !!talk.myVote) ? talk.myVote : null;
        const body = !!lastVote ? {...lastVote, ...rate} : rate;

        const method = 'POST';
        const headers = {Token: state.token};

        return fetch(`api/talks/rate/${id}`, {method, body: JSON.stringify(body), headers})
            .then(response => response.json())
            .then((json: JsonTalk) => {
                console.log('rate result', {json});
                const idx = state.rawTalks.findIndex(talk => !!talk && talk.id === json.id);
                const newTalk = jsonTalkMapper(json, state.me);
                const rawTalks = state.rawTalks.set(idx, newTalk);
                return {...state, rawTalks};
            })
            .catch(error => ({...state, error}));
    }
}