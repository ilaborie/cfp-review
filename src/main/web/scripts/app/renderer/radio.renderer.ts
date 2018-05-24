import {createRenderer} from '../../frwk/renderer';

let i = 0;

export interface RadioElement {
    name: string;
    selected?: boolean;
    label: string;
    value: string;
}

export const toRadioElement = (
    name: string,
    labels: { [index: string]: string },
    isSelected: (value: string) => boolean) =>
    (value: string): RadioElement =>
        ({
            name,
            value,
            label: labels[value] || value,
            selected: isSelected(value)
        });


export const radioRenderer =
    createRenderer<RadioElement>(radioElt => {
        const {name, selected, label, value} = radioElt;
        const id = `${name}_${++i}`;

        return `
<div class="form-check">
  <input class="form-check-input" type="radio" name="${name}" id="${id}" value="${value}" ${selected ? 'checked' : ''}>
  <label class="form-check-label" for="${id}">${label || value}</label>
</div>`;
    });