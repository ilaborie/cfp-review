import {createRenderer} from '../../frwk/renderer';
import {getFormat} from '../models/Format';

export const formatRenderer =
    createRenderer<number>(formatId => {
        const format = getFormat(formatId);

        if (format) {
            return `
<div class="format" title="${format.description}">
  <i class="${format.icon}"></i>
  ${format.name}
</div>`;
        } else {
            return `<div class="format">Format: ${formatId}</div>`;
        }
    });