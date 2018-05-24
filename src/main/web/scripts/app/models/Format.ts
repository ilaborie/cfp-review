import {List} from 'immutable';

export interface Format {
    id: number;
    name: string;
    duration: number;
    description: string;
    icon: string;
}

const formats: Format[] = [{
    id: 149,
    name: 'Conference',
    duration: 40,
    description: 'This year, the conferences are 40 minutes long (No questions, we are asking the speakers to be at the speaker booth the next half hour to answer questions regarding their subject',
    icon: 'fab fa-slideshare'
}, {
    id: 150,
    name: 'Lightning talk',
    duration: 15,
    description: 'Very short presentation lasting only a few minutes. No questions and office hours too',
    icon: 'fas fa-clock'
}];

export const formatList: List<Format> = List(formats);

export const getFormat = (formatId: number) =>
    formats.find(format => format.id === formatId);

export const findFormatByName = (name: string) =>
    formats.find(format => format.name === name);