import {Rate} from './Rate';
import {JsonSpeaker, jsonSpeakerMapper, Speaker} from './Speaker';
import {List, Map} from 'immutable';


export type TalkState = 'DRAFT' | 'CONFIRMED' | 'ACCEPTED' | 'REFUSED' | 'BACKUP';

export interface JsonTalk {
    added: number;
    cospeakers: JsonSpeaker[];
    description: string;
    difficulty: number;
    eventId: string;
    format: number;
    id: number;
    language: string | null;
    name: string;
    speaker: JsonSpeaker;
    state: TalkState;
    trackId: number;
    trackLabel: string;
    voteUsersEmail: string[];
    references: string | null;
    slides: string | null;
    video: string | null;
    mean: number | null;
    rates: {
        [index: string]: Rate;
    }
}

export interface Talk {
    id: number;
    eventId: string;
    added: number;
    name: string;
    speaker: Speaker;
    cospeakers: List<Speaker>;
    format: number;
    difficulty: number;
    description: string;
    language: string | null;
    state: TalkState;
    trackId: number;
    trackLabel: string;
    voteUsersEmail: List<string>;
    references: string | null;
    slides: string | null;
    video: string | null;
    mean: number | null;
    rates: Map<string, Rate>;
    myVote: Rate | null;
}

export const jsonTalkMapper = (jsonTalk: JsonTalk, me: string): Talk => {
    let rates = Map(jsonTalk.rates);
    return ({
        ...jsonTalk,
        voteUsersEmail: List(jsonTalk.voteUsersEmail),
        speaker: jsonSpeakerMapper(jsonTalk.speaker),
        cospeakers: List(jsonTalk.cospeakers.map(jsonSpeakerMapper)),
        rates,
        myVote: rates.get(me)
    });
};