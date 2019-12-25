// Human-readable generic types
type Id<T> = T;
type FunctionType<T extends (...args: any) => any> = Id<(...args: Parameters<T>) => ReturnType<T>>;

class Binding<T>{
    constructor(public fn: T, public context: any, public once: boolean = false) { };
}

export class EventDispatcher<Events extends { [key: string]: (...args: any) => any; } = { [key: string]: (...args: any) => any; }, K extends keyof Events = keyof Events> {

    protected _bindings: { [key in K]?: Binding<FunctionType<Events[K]>>[]; } = {};

    on(event: K, fn: FunctionType<Events[K]>, context: any = null, once: boolean = false) {
        if (!this._bindings[event])
            this._bindings[event] = [];
        this._bindings[event].push(new Binding<FunctionType<Events[K]>>(fn, context, once));
    };

    once(event: K, fn: FunctionType<Events[K]>, context: any = null) {
        this.on(event, fn, context, true);
    };

    off(event: K, fn?: FunctionType<Events[K]>, context: any = null) {
        let listeners = this._bindings[event];
        if (!listeners || listeners.length === 0) return this;
        if (!fn) {
            // delete all listeners
            this._bindings[event].length = 0;
            return this;
        }
        for (let i = listeners.length - 1; i >= 0; i--) {
            if (listeners[i].fn === fn && context === listeners[i].context) {
                listeners.splice(i, 1);
                return this;
            }
        }
        return this;
    };

    emit(event: K, ...args: Parameters<Events[K]>): boolean {
        if (!this._bindings[event]) return false;
        let listeners = this._bindings[event];
        let listener;
        for (let i = 0; i < listeners.length; i++) {
            listener = listeners[i];
            if (listener.once) this.off(event, listener.fn, listener.context);
            listener.fn.apply(listener.context, args);
        }
        return true;
    };

    clear() {
        this._bindings = {};
    }

    addEventListener = this.on;
    addEventListenerOnce = this.once;
    removeEventListener = this.off;
    dispatch = this.emit;
    removeAllEventListeners = this.clear;
}
