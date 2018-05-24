import {List} from 'immutable'

import {App} from '../frwk/application';

import {AppState} from './models/AppState';
import {Talk} from './models/Talk';
import {appRenderer} from './renderer/app.renderer';
import {fetchTalksAction, SetFilterAction, SetSortingAction, SetTokenAction, VoteAction} from './actions';
import {Rate} from './models/Rate';
import {$$} from './utils';

const init: AppState = {
    token: '',
    me: '',
    loading: false,
    rawTalks: List<Talk>(),

    // default sort
    sorting: {
        direction: 'desc',
        attr: 'added'
    },

    // default filter
    filtering: {
        format: 'Tous',
        theme: 'Tous',
        state: 'CONFIRMED',
        vote: 'nope',
        lang: 'Tous',
        lovehate: 'Tous'
    }
};

type FormUpdateHandler = (attr: string, value: string, formElt?: HTMLFormElement) => void;
const onFormUpdate = (name: string, effect: FormUpdateHandler) =>
    $$(`form[name=${name}]`, (formElt: HTMLFormElement) => {
            formElt.onchange = event => {
                if (event.target && event.target['name']) {
                    const attr = '' + event.target['name'];
                    const {value} = formElt[attr];
                    effect(attr, value, formElt);
                }
            }
        }
    );

type FormSubmitHandler = (form: HTMLFormElement) => void;
const onFormSubmit = (name: string, effect: FormSubmitHandler) =>
    $$(`form[name=${name}]`, (formElt: HTMLFormElement) => {
        formElt.onsubmit = (event: Event) => {
            event.preventDefault();
            event.stopPropagation();
            effect(formElt);
        }
    });

export default (elt: Element) => {
    const app = new App<AppState>(elt, init, appRenderer);

    app.didUpdate = function registerFormActions() {
        const app = this;
        // JWT token
        onFormUpdate('jwtForm', (attr, value) =>
            app.dispatch(new SetTokenAction(value))
                .then(() => app.dispatch(fetchTalksAction)));

        onFormSubmit('jwtForm', form =>
            app.dispatch(new SetTokenAction(form.jwt['value']))
                .then(() => app.dispatch(fetchTalksAction)));

        // Filter for talks
        onFormUpdate('talksFilter', (attr, value) =>
            app.dispatch(new SetFilterAction({attr, value})));

        // Sort for talks
        onFormUpdate('talksSort', (attr, value) =>
            app.dispatch(new SetSortingAction({attr, value})));

        // voteForm
        onFormSubmit('voteForm', (form) => {
            const id = form.id['value'];
            const evaluate = form.evaluate['value'];
            const stars = form.stars['value'];
            // handle lover, hate, nope
            const rate: Rate = {
                rate: 0,
                hate: false,
                love: false
            };
            switch (evaluate) {
                case 'hate':
                    rate.hate = true;
                    rate.rate = 1;
                    break;
                case 'love':
                    rate.love = true;
                    rate.rate = 5;
                    break;
                case 'neutral':
                    rate.rate = parseInt(stars, 10);
                    break;
            }
            app.dispatch(new VoteAction({id, rate}));
        });
        onFormUpdate('voteForm', (attr, value, formElt) => {
            if (attr === 'evaluate' && formElt) {
                const stars = formElt.querySelector('.stars');
                if (stars) {
                    (stars as HTMLElement).style.display = value === 'neutral' ? 'block' : 'none';
                }
            }
        });

    };
    return app;
};

