import {List} from 'immutable';

import {createRenderer} from '../../frwk/renderer';

import {AppState} from '../models/AppState';
import {Talk} from '../models/Talk';
import {createFilter} from '../models/filter';
import {createSorting} from '../models/sort';
import {talkRenderer} from './talk.renderer';
import {filterRenderer} from './filter.renderer';
import {attrLabel, dirLabel, sortRenderer} from './sort.renderer';


const renderSection = (state: AppState, talks: List<Talk>) => {
    const {attr, direction} = state.sorting;

    return `
    <section>
    
      <header style="display: ${state.token ? 'block' : 'none'};">
        <details class="filter card border-dark" open>
          <summary class="card-header">
            Filtrer
            <span class="badge badge-dark">${talks.size} / ${state.rawTalks.size}</span>
          </summary>
          ${filterRenderer.d(state)}
        </details>
        
        <details class="sort card border-dark" open>
          <summary class="card-header">
            Trier
            <span class="badge badge-dark">${dirLabel[direction] || ''}&nbsp;&nbsp; ${attrLabel[attr] || ''}</span>
          </summary>
          ${sortRenderer.d(state)}
        </details>
      </header>
      
      <div class="talks">
        ${talkRenderer.col(talks)}
      </div>
      
    </section>`;
};

export const appRenderer = createRenderer<AppState>(state => {
    const filter = createFilter(state);
    const sorting = createSorting(state);

    const talks = state.rawTalks
        .filter((talk?: Talk) => !!talk && filter(talk))
        .sort(sorting).toList();

    return `
    <nav class="navbar navbar-light bg-light">
      <a class="navbar-brand" href="#">
        <img src="https://devfesttoulouse.fr/images/logo-monochrome.svg" class="d-inline-block align-top" alt="">
        CFP Revue 2018
      </a>
      <form class="form-inline" name="jwtForm">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text"><i class="fas fa-key"></i></span>
          </div>
          <input type="text" class="form-control" name="jwt" placeholder="User JWT Token" aria-label="jwt" autocomplete="on" value="${state.token}">
        </div>
      </form>
    </nav>
    
    ${state.error ? `<div class="alert alert-danger" role="alert">${state.error}</div>` : ''}
    ${!state.token ? `<div class="alert alert-warning" role="alert">Entrer le token JWT !</div>` : ''}
    
    
    ${state.loading ? `
  <div class="placeholder">
    <span>⚠️ désoler, c'est lent (~1 min), on doit faire une requête/talk pour avoir les notes</span>
    <span class="loading"></span>
  </div>` : renderSection(state, talks)}
    `;
});