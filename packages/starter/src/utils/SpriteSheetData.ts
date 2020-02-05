export class SpriteSheetData {

    constructor(public src: string, public json: any) {
    }

    getRegion(src: string): { l: number, r: number, t: number, b: number } {
        return this.json.region[src];
    }
}