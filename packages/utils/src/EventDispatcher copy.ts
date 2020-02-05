class Binding {
    constructor(public fn: Function, public context: any, public once: boolean = false) { }
}

export class EventDispatcher {

    protected _bindings: { [k: string]: Binding[] } = {};

    on(event: string, fn: (...args: any[]) => any, context: any = null, once: boolean = false) {
        let listener = new Binding(fn, context, once);
        if (!this._bindings[event]) {
            this._bindings[event] = [];
        }
        this._bindings[event].push(listener);
    };

    addEventListener = this.on;

    once(event: string, fn: (...args: any[]) => any, context: any) {
        this.on(event, fn, context, true);
    };

    emit(event: string, ...args: any[]): boolean {
        if (!this._bindings[event]) return false;
        let listeners = this._bindings[event];
        let listener
        for (let i = 0; i < listeners.length; i++) {
            listener = listeners[i];
            if (listener.once) this.off(event, listener.fn, listener.context);
            listener.fn.apply(listener.context, args);
        }
        return true;
    };

    dispatch = this.emit;

    off(event: string, fn?: Function, context?: any) {
        if (!this._bindings[event] || this._bindings[event].length === 0) return this;
        if (!fn) {
            // delete all listeners
            this._bindings[event].length = 0;
            return this;
        }
        let listeners = this._bindings[event];
        for (let i = 0; i < listeners.length; i++) {
            if (listeners[i].fn === fn && context === listeners[i].context) {
                listeners.splice(i, 1);
                return this;
            }
        }
        return this;
    };
}
