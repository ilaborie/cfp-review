export interface Action<P, S> {
    payload?: P;
    shouldRender: boolean;

    apply(state: S): Promise<S>
}

export const createAction = <S>(fun: (state: S) => Promise<S>, shouldRender: boolean = true): Action<any, S> => ({
    shouldRender,
    apply: (state: S): Promise<S> => fun(state)
});

export const nopeAction: Action<void, any> = createAction(state => Promise.resolve(state), false);
