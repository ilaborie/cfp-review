import {Set} from 'immutable';

export interface JsonSpeaker {
    id: number;
    admin: boolean;
    bio: string | null;
    company: string | null;
    email: string;
    firstname: string;
    gender: string;
    github: string | null;
    googleplus: string | null;
    imageProfilURL: string | null;
    language: string | null;
    lastname: string;
    locale: string;
    owner: boolean;
    phone: string | null;
    reviewer: boolean;
    roles: string[];
    shortName: string;
    social: string | null;
    tshirtSize: string;
    twitter: string;
    twitterCount: number;
}


export interface Speaker {
    id: number;
    admin: boolean;
    bio: string | null;
    company: string | null;
    email: string;
    firstname: string;
    gender: string;
    github: string | null;
    googleplus: string | null;
    imageProfilURL: string | null;
    language: string | null;
    lastname: string;
    locale: string;
    owner: boolean;
    phone: string | null;
    reviewer: boolean;
    roles: Set<string>;
    shortName: string;
    social: string | null;
    tshirtSize: string;
    twitter: string;
    twitterCount: number;
}


export const jsonSpeakerMapper = (jsonSpeaker: JsonSpeaker): Speaker =>
    ({...jsonSpeaker, roles: Set(jsonSpeaker.roles)});

