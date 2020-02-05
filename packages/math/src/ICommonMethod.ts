export interface ICommonMethod<T> {
    reset(...args: any[]): T;
    equal(other: T): boolean;
    copyFrom(target: T): T;
    clone(): T;
    toString(): string;
}