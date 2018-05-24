import {List} from 'immutable';

import {createRenderer, Renderer} from '../../frwk/renderer';

import {AppState} from '../models/AppState';
import {formatList} from '../models/Format';
import {RadioElement, radioRenderer, toRadioElement} from './radio.renderer';
import {themesList} from '../models/Theme';

const toRadioElt = (state: AppState, name: string) => (value: string): RadioElement =>
    ({name, value, label: value, selected: (state.filtering[name] === value)});


const langLabel = {
    'Français': '🇫🇷',
    'English': '🇺🇸',
    'Tous': 'Tous'
};

const loveHateLabel = {
    love: '💖',
    hate: '🤢',
    'Tous': 'Tous'
};

export const filterRenderer: Renderer<AppState> = createRenderer(state => {

    const formats = formatList
        .map(format => format ? format.name : '')
        .concat('Tous')
        .map(value => toRadioElt(state, 'format')(value || ''));

    const themes = themesList
        .map(theme => theme ? theme.libelle : '')
        .concat('Tous')
        .map(value => toRadioElt(state, 'theme')(value || ''));

    const statusLabel = (radioElt?: RadioElement) => (radioElt && radioElt.value !== '') ? radioElt.value : 'Tous';
    const status = List.of('DRAFT', 'CONFIRMED', 'ACCEPTED', 'REFUSED', 'BACKUP', '')
        .map(value => toRadioElt(state, 'state')(value || ''))
        .map(radioElt => ({...radioElt, label: statusLabel(radioElt)} as RadioElement));

    const votesLabel = {
        me: `J'ai voté`,
        notMe: `Je n'ai pas voté`,
        nope: 'Plop'
    };
    const votes = List.of('me', 'notMe', 'nope')
        .map(value => toRadioElt(state, 'vote')(value || ''))
        .map(radioElt => ({...radioElt, label: votesLabel[radioElt ? radioElt.value : '']} as RadioElement));

    const langs = List.of('Français', 'English', 'Tous')
        .map(value => toRadioElement('lang', langLabel, value => state.filtering['lang'] === value)(value||''));

    const loveHate = List.of('love', 'hate', 'Tous')
        .map(value => toRadioElement('lovehate', loveHateLabel, value => state.filtering['lovehate'] === value)(value||''));

    const {txtFilter, sinceFilter} = state.filtering;
    return `
<form name="talksFilter">
  
  <div class="form-group txt">
    <div class="card-body input-group">
      <div class="input-group-prepend">
        <span class="input-group-text"><i class="fas fa-search"></i></span>
      </div>
      <input type="text" class="form-control" name="txtFilter" value="${txtFilter || ''}">
    </div>
    
    <div class="card-body input-group">
      <div class="input-group-prepend">
        <span class="input-group-text">Depuis</span>
      </div>
      <input type="date" class="form-control" name="sinceFilter" value="${sinceFilter}">
    </div>
  </div>

  <div class="card form-group format">
    <label class="card-title card-header">Format</label>
    <div class="card-body">
      ${radioRenderer.col(formats)}
    </div>
  </div>
  
  <div class="card form-group theme">
    <label class="card-title card-header">Thème</label>
    <div class="card-body">
      ${radioRenderer.col(themes)}
    </div>
  </div>
  
  <div class="card form-group status">
    <label class="card-title card-header">Status</label>
    <div class="card-body">
      ${radioRenderer.col(status)}
    </div>
  </div>
  
  <div class="card form-group vote">
    <label class="card-title card-header">Votes</label>
    <div class="card-body">
      ${radioRenderer.col(votes)}
    </div>
  </div>
  
  <div class="card form-group langs">
    <label class="card-title card-header">Langage</label>
    <div class="card-body">
      ${radioRenderer.col(langs)}
    </div>
  </div>
  
  <div class="card form-group loveHate">
    <label class="card-title card-header">Évaluation</label>
    <div class="card-body">
      ${radioRenderer.col(loveHate)}
    </div>
  </div>
  
</form>`;
});