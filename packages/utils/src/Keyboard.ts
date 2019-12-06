export class Keyboard {

    protected _isPressed: boolean[] = [];
    protected _isClicked: boolean[] = [];

    public constructor() {
        this.init();
    }

    protected init(): void {
        let len: number = KeyboardEnum.LastKeyCode;
        for (let i: number = 0; i < len; i++) {
            this._isPressed[i] = false;
            this._isClicked[i] = false;
        }

        window.addEventListener('keyup', (e: KeyboardEvent) => this._onKeyUp(e));
        window.addEventListener('keydown', (e: KeyboardEvent) => this._onKeyDown(e));
    }

    protected _onKeyDown(event: KeyboardEvent): void {
        this._isPressed[event.keyCode] = true;
    }

    protected _onKeyUp(event: KeyboardEvent): void {
        this._isPressed[event.keyCode] = false;
        this._isClicked[event.keyCode] = false;
    }

    /**
     * 应该在update中调用此方法
     * 
     * @param {number} keyCode (description)
     * @returns {boolean} (description)
     */
    public isPressed(keyCode: number): boolean {
        return this._isPressed[keyCode];
    }
    /**
     * 应该在update中调用此方法
     * 
     * @param {number} keyCode (description)
     * @returns {boolean} (description)
     */
    public isClicked(keyCode: number): boolean {
        if (this._isPressed[keyCode] && !this._isClicked[keyCode]) {
            this._isClicked[keyCode] = true;
            return true;
        }
        return false;
    }
}

export enum KeyboardEnum {

    // arrows
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40,

    // space bar
    Space = 32,

    // numbers 
    Zero = 48,
    One = 49,
    Two = 50,
    Three = 51,
    Four = 52,
    Five = 53,
    Six = 54,
    Seven = 55,
    Eight = 56,
    Nine = 57,

    // alphabets
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,

    LastKeyCode = 222

}
