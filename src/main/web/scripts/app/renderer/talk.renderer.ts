import marked from 'marked';
import {createRenderer} from '../../frwk/renderer';
import {Talk} from '../models/Talk';
import {getTheme} from '../models/Theme';
import {speakerRenderer} from './speaker.renderer';
import {formatRenderer} from './format.renderer';
import {themeRenderer} from './theme.renderer';
import {dateRenderer} from './date.renderer';
import { talkVoteRenderer } from './talkvote.renderer';


const lang = (lang: string): string => {
    switch (lang) {
        case 'Français':
            return '🇫🇷';
        case 'English':
            return '🇺🇸';
        default:
            return '';
    }
};

const stateClass = (state: string): string => {
    switch (state) {
        case 'DRAFT':
            return 'badge-warning';
        case 'CONFIRMED':
            return 'badge-success';
        case 'ACCEPTED':
            return 'badge-primary';
        case 'BACKUP':
            return 'badge-secondary';
        case 'REFUSED':
            return 'badge-danger';
        default:
            return 'badge-light';
    }
};

const difficulties = (value: number): string =>
    Array.from(Array(3).keys())
        .map(i => (i < value) ? 'fas' : 'far')
        .map(c => `<i class="${c} fa-star"></i>`)
        .join('');

export const talkRenderer = createRenderer<Talk>(talk => {
    const theme = getTheme(talk.trackId);
    return `
    <div class="talk card" style="color: ${theme ? theme.color : 'transparent'}">
      <div class="card-header" style="color: initial">
        <h5 class="card-title">
          ${dateRenderer.d(talk.added)}
          <!--<small>[${talk.id}]</small>-->
          <span class="badge badge-light">${lang(talk.language || '')}</span>
          <span class="badge ${stateClass(talk.state)}">${talk.state}</span>
          ${talk.name}
        </h5>
        <h6 class="card-subtitle mb-2">
          ${themeRenderer.d(talk.trackId)}
          <span class="level" title="Difficulté">${difficulties(talk.difficulty)}</span>
          ${formatRenderer.d(talk.format)}
        </h6>
      </div>
       <div class="card-body" style="color: initial">
        <a href="https://devfest-toulouse.cfp.io/#/admin/sessions/${talk.id}?tab=vote">Open on cfp.io</a>       
        <p class="card-text">${marked(talk.description)}</p>
        ${talk.slides ? `<a href="${talk.slides}" class="card-link slides"><i class="fab fa-slideshare"></i> Slides</a>` : ''}
        ${talk.video ? `<a href="${talk.video}" class="card-link video"><i class="fab fa-youtube"></i> Vidéo</a>` : ''}
        ${talk.references ? `
          <details>
            <summary>References</summary>
            ${marked(talk.references || '')}
          </details>` : ''}
        
          <details>
            <summary>Debug</summary>
            <pre>${JSON.stringify(talk, null, 2)}</pre>
          </details>
       </div>
       <div class="card-footer" style="color: initial">
          ${speakerRenderer.d(talk.speaker)}
          ${speakerRenderer.col(talk.cospeakers)}
       </div>
    </div>
    ${talkVoteRenderer.d(talk)}
    `;
});