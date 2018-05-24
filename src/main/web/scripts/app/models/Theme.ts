import {List} from 'immutable';

export interface Theme {
    id: number;
    libelle: string;
    description?: string;
    color: string;
}

const themes: Theme[] = [{
    id: 233,
    libelle: 'Native mobile apps',
    description: 'Android / Iphone / React  Native,...',
    color: '#ff8080'
}, {id: 234, libelle: 'Web', description: 'Latest web technologies', color: '#ffff80'}, {
    id: 235,
    libelle: 'Method & Tools',
    description: 'Craftmanship, CI/CD',
    color: '#80ff80'
}, {
    id: 236,
    libelle: 'Big Data / ML / AI',
    description: 'Big Data / Machine Learning / Artificial Intelligence',
    color: '#80ffff'
}, {id: 237, libelle: 'UX', description: 'User eXperience', color: '#804040'}, {
    id: 238,
    libelle: 'IOT',
    description: 'Internet Of Things',
    color: '#c0c0c0'
}, {id: 239, libelle: 'Cloud', description: 'Everything related to Cloud computing', color: '#ff00ff'}, {
    id: 242,
    libelle: 'Languages',
    color: '#008080'
}, {id: 243, libelle: 'WTF', color: '#bdc624'}];


export const themesList: List<Theme> = List(themes);

export const getTheme = (themeId: number) =>
    themes.find(theme => theme.id === themeId);

export const findThemeByName = (name: string) =>
    themes.find(theme => theme.libelle === name);