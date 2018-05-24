export const $ = <T extends Element>(selector: string, consumer?: (t: T) => any): T | null => {
    const t = document.querySelector(selector) as T;
    if (t) {
        if (consumer) {
            consumer(t);
        }
        return t;
    } else {
        return null;
    }
};

export const $$ = <T extends Element>(selector: string, consumer?: (t: T) => any): T[] => {
    const ts = Array.from(document.querySelectorAll(selector)) as T[];
    if (consumer) {
        ts.forEach(consumer);
    }
    return ts;
};