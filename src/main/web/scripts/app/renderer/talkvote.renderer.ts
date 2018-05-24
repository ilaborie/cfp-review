import {createRenderer} from '../../frwk/renderer';

import {Talk} from '../models/Talk';


const stars = (n: number, id: number, value: number) =>
    Array.from(Array(n), (_, i) => n - i - 1)
        .map(i => {
            const radioId = `stars-${id}-${i}`;
            return `
            <input type="radio" value="${i + 1}" name="stars" id="${radioId}" ${value === (i + 1) ? 'checked' : ''}>
            <label for="${radioId}"></label>
            `;
        })
        .join('\n');

export const talkVoteRenderer = createRenderer<Talk>(talk => {
    const {id, myVote} = talk;

    let evaluate: string = 'neutral';
    let starsValue: number = -1;
    if (myVote) {
        const {love, hate, rate} = myVote;
        if (love) {
            evaluate = 'love';
            starsValue = 5;
        } else if (hate) {
            evaluate = 'have';
            starsValue = 1;
        } else if (rate === 0) {
            evaluate = 'nope';
        } else {
            starsValue = rate;
        }
    }

    const loves = talk.rates
        .filter(rate => !!rate && rate.love)
        .map(() => '💖')
        .join('');

    const hates = talk.rates
        .filter(rate => !!rate && rate.hate)
        .map(() => '🤢')
        .join('');

    return `
    <div class="talk-vote card" xmlns="http://www.w3.org/1999/html">
      <div class="card-header">
        <h5 class="card-title">
          Évaluation
         ${talk.mean ? `<span class="badge badge-pill badge-info">${talk.mean.toFixed(2)}</span>` : ''}
         <span class="loves">${loves}</span>
         <span class="hates">${hates}</span>
        </h5>
      </div>
      <div class="card-body">
        <details open>
            <summary>Vote</summary>
            <form name="voteForm">
                <input type="hidden" name="id" value="${id}">
                <div class="evaluate">
                    <input type="radio" value="nope" name="evaluate" id="nope-${id}" ${evaluate === 'nope' ? 'checked' : ''}>
                    <label for="nope-${id}">Pas d'avis</label>
                    
                    <input type="radio" value="hate" name="evaluate" id="hate-${id}" ${evaluate === 'hate' ? 'checked' : ''}>
                    <label for="hate-${id}">🤮</label>
                    
                    <input type="radio" value="neutral" name="evaluate" id="neutral-${id}" ${evaluate === 'neutral' ? 'checked' : ''}>
                    <label for="neutral-${id}">😐</label>
                    
                    <input type="radio" value="love" name="evaluate" id="love-${id}" ${evaluate === 'love' ? 'checked' : ''}>
                    <label for="love-${id}">💖</label>
                </div>
                <em>Les notes ne sont comptabilisé que si 😐 est sélectionné</em>
                <div class="stars">
                  ${stars(5, talk.id, starsValue)}
                </div>
                <button class="btn btn-primary">Valider</button>
            </form>
        </details> 

        <details>
          <summary>Votants <span class="badge badge-pill badge-secondary">${talk.voteUsersEmail.size}</span></summary>
          ${talk.voteUsersEmail.map(elt => `<div>${elt}</div>`).join('\n')}
        </details>
      </div>
    </div>`;
});