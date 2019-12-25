export class ImageLoader {

    protected _imgLoaded: number = 0;
    protected _imgTotal: number = 0;
    protected _map: { [key: string]: HTMLImageElement } = {};

    async load(url: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            this._imgTotal++;
            let img = new Image();
            img.onload = () => {
                resolve(img);
            };
            img.onerror = () => {
                reject();
            }
            img.src = url;
            this._map[url] = img;
        })

    }

    get(url: string): HTMLImageElement | null {
        return this._map[url];
    }

}