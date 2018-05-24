import {createRenderer} from '../../frwk/renderer';


const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric', month: 'numeric', day: 'numeric'
});

const fullDateFormatter = new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false
});

export const dateRenderer =
    createRenderer<number>(epoch => {
        const date = new Date(epoch);
        return `<span class="date" title="${fullDateFormatter.format(date)}">
  ${dateFormatter.format(date)}
</span>`;
    });