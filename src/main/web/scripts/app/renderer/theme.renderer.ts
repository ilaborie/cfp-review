import {getTheme} from '../models/Theme';
import {createRenderer} from '../../frwk/renderer';

export const themeRenderer = createRenderer<number>(themeId => {
    const theme = getTheme(themeId);
    return theme ? `
<div class="theme" title="${theme.description || ''}" style="color:${theme.color};">
  <i class="fas fa-tags"></i>
  ${theme.libelle}
</div>` : `<div class="theme">Theme: ${themeId}</div>`;
});