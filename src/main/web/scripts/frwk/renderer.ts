import {Collection, Map} from 'immutable';

export abstract class Renderer<P> {
    private cache: Map<P, string> = Map();

    protected abstract render(props: P): string;

    d(props: P): string {
        const updateCache = (): string => {
            const result = this.render(props);
            this.cache = this.cache.set(props, result);
            return result;
        };
        return this.cache.has(props) ? this.cache.get(props) : updateCache();
    }

    col<K>(values: Collection<K, P>): string {
        return values //
            .map(value => value ? this.d(value) : '')
            .join('\n')
    }
}

class SimpleRenderer<P> extends Renderer<P> {

    constructor(private readonly fun: (props: P) => string) {
        super();
    }

    protected render(props: P): string {
        return this.fun(props);
    }
}

export const createRenderer = <P>(fun: (props: P) => string): Renderer<P> =>
    new SimpleRenderer(fun);