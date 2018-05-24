import {Action} from './actions';
import {Renderer} from './renderer';

// TODO freeze in dev mode
// TODO provide redux devtools integration
//      see https://medium.com/@zalmoxis/redux-devtools-without-redux-or-how-to-have-a-predictable-state-with-any-architecture-61c5f5a7716f
export class App<S> {
    private state: Promise<S>;

    public didUpdate: (state: S) => void =
        (state) => console.log({state});

    constructor(private readonly elt: Element, initialState: S, private mainRenderer: Renderer<S>) {
        this.state = Promise.resolve(initialState);
        this.render(initialState);
    }

    private render(state: S) {
        this.state = this.state
            .then(() => {
                this.elt.innerHTML = this.mainRenderer.d(state);
                this.didUpdate(state);
                // console.debug({state});
                return state;
            });
    }

    dispatch<P>(action: Action<P, S>): Promise<S> {
        return this.state
            .then(state => action.apply(state))
            .then(state => {
                // console.debug('action applied', {action, state});
                return state
            })
            .then(newState => {
                if (action.shouldRender) {
                    this.render(newState);
                }
                return newState;
            });
    }
}