import {List} from 'immutable';

import {createRenderer, Renderer} from '../../frwk/renderer';

import {AppState} from '../models/AppState';
import {radioRenderer, toRadioElement} from './radio.renderer';

const toRadioElt = (state: AppState, name: 'attr' | 'direction', labels: { [index: string]: string }) =>
    toRadioElement(name, labels, (value: string) => (state.sorting[name] === value));

export const attrLabel = {
    added: `Date d'ajout`,
    mean: `Notes`,
    difficulty: `Difficulté`,
    state: `État`,
    name: `Titre`,
    speaker: `Speaker`,
    followers: `Followers`,
    theme: `Thème`,
    format: `Type de conf.`
};

export const dirLabel = {
    asc: '<i class="fas fa-sort-amount-up"></i>',
    desc: '<i class="fas fa-sort-amount-down"></i>'
};

export const sortRenderer: Renderer<AppState> = createRenderer(state => {
    const sortAttrs = List(Object.keys(attrLabel))
        .map(value => toRadioElt(state, 'attr', attrLabel)(value || ''));

    const dirAttrs = List(Object.keys(dirLabel))
        .map(value => toRadioElt(state, 'direction', dirLabel)(value || ''));

    return `
<form name="talksSort">
 
  <div class="card-body">
    ${radioRenderer.col(sortAttrs)}
  </div>
  <div class="card-body">
    ${radioRenderer.col(dirAttrs)}
  </div>
  
</form>`;
});