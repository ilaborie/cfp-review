import {Speaker} from './Speaker';
import {AppState} from './AppState';
import {findFormatByName} from './Format';
import {findThemeByName} from './Theme';
import {Talk, TalkState} from './Talk';

export interface Filter<T> {
    (elt: T): boolean;
}

export const noFilter: Filter<any> = (_: any) => true;

export const filterByAttrValue = <T, A extends keyof T>(attr: A, value: T[A]): Filter<T> =>
    (elt: T) => elt[attr] === value;


export const and = <T>(...filters: Filter<T>[]): Filter<T> =>
    (t: T) => filters.reduce((acc, filter) => acc && filter(t), true);

export const not = <T>(filter: Filter<T>): Filter<T> =>
    (t: T) => !filter(t);

// Speaker Filter
const textFilterSpeaker = (text: string): Filter<Speaker> => speaker => {
    const crit = text.toLowerCase();
    return speaker.lastname.toLowerCase().includes(crit) ||
        speaker.firstname.toLowerCase().includes(crit) ||
        (speaker.company || '').toLowerCase().includes(crit);
};

// Talk Filter
const textFilter = (text: string): Filter<Talk> => talk => {
    const crit = text.toLowerCase();
    const speakerFilter = textFilterSpeaker(crit);

    return talk.name.toLowerCase().includes(crit) ||
        talk.description.toLowerCase().includes(crit) ||
        speakerFilter(talk.speaker) ||
        talk.cospeakers.some(s => !!s && speakerFilter(s));
};

const dateFilter = (since: string): Filter<Talk> => talk => {
    const date = new Date(since).getTime();
    return talk.added > date;
};
const loveHateFilter = (loveHate: string): Filter<Talk> => talk => {
    switch (loveHate) {
        case 'love':
            return !!talk.rates.find(rate => !!rate && rate.love);
        case 'hate':
            return !!talk.rates.find(rate => !!rate && rate.hate);
        default:
            return true;
    }
};
const filterByLang = (lang: string): Filter<Talk> => talk => {
    switch (lang) {
        case 'Tous':
            return true;
        default:
            return talk.language === lang;
    }
};

export const createFilter = (state: AppState): Filter<Talk> => {
    const {vote, txtFilter, sinceFilter, lang, lovehate} = state.filtering;
    const format = findFormatByName(state.filtering.format || '');
    const theme = findThemeByName(state.filtering.theme || '');
    const iVote: Filter<Talk> = (talk: Talk) => talk.voteUsersEmail && talk.voteUsersEmail.includes(state.me);

    return and(
        format ? filterByAttrValue<Talk, 'format'>('format', format.id) : noFilter,
        theme ? filterByAttrValue<Talk, 'trackId'>('trackId', theme.id) : noFilter,
        state.filtering.state ? filterByAttrValue<Talk, 'state'>('state', state.filtering.state as TalkState) : noFilter,
        (vote === 'me') ? iVote : (vote === 'notMe' ? not(iVote) : noFilter),
        txtFilter ? textFilter(txtFilter) : noFilter,
        sinceFilter ? dateFilter(sinceFilter) : noFilter,
        lang ? filterByLang(lang): noFilter,
        lovehate ? loveHateFilter(lovehate) : noFilter
    );
};