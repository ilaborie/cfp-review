import marked from 'marked';

import {createRenderer} from '../../frwk/renderer';

import {Speaker} from '../models/Speaker';

export const speakerRenderer =
    createRenderer<Speaker>(speaker => `
<details class="speaker">
  <summary>
      ${speaker.imageProfilURL ? `<img src="${speaker.imageProfilURL}">` : ''}
      <span class="name">${speaker.firstname} ${speaker.lastname}</span>
      <span class="badge badge-info twitterCount">${speaker.twitterCount?`${speaker.twitterCount} followers`:''}</span>
      <span class="sep"></span>
      <span class="badge badge-dark company">${speaker.company || ''}</span>
  </summary>
  <div>
    <p class="text-muted">${marked(speaker.bio || '')}</p>
    <div> 
        ${speaker.email ? `<a href="mailto:${speaker.email}" class="btn btn-light"><i class="fas fa-envelope"></i></a>` : ''}
        ${speaker.twitter ? `<a href="http://twitter.com/${speaker.twitter}" class="btn btn-light"><i class="fab fa-twitter"></i></a>` : ''}
        ${speaker.github ? `<a href="http://github.com/${speaker.github}" class="btn btn-light"><i class="fab fa-github"></i></a>` : ''}
        ${speaker.googleplus ? `<a href="${speaker.googleplus}" class="btn btn-light"><i class="fab fa-google-plus-g"></i></a>` : ''}
        ${speaker.social ? `<a href="${speaker.social}" class="btn btn-light"><i class="fas fa-globe"></i></a>` : ''}
    </div>
  </div>
</details>`
    );