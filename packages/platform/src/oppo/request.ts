import { IRequestOptions, IRequestResponse } from "../IPlatform";

function serializeParams(params: any) {
    if (!params) {
        return ''
    }
    return Object.keys(params)
        .map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)).join('&')
}

function generateRequestUrlWithParams(url: string, params: any) {
    params = typeof params === 'string' ? params : serializeParams(params)
    if (params) {
        url += (~url.indexOf('?') ? '&' : '?') + params
    }
    url = url.replace('?&', '?')
    return url
}

export function request<T>(options: IRequestOptions): Promise<IRequestResponse<T>> {
    let url = options.url
    const params: any = {}

    params.method = options.method || 'GET'
    const methodUpper = params.method.toUpperCase();
    if (!options.header) {
        options.header = { 'content-type': 'json' };
    }

    let contentType = options.header && (options.header['Content-Type'] || options.header['content-type'])

    if (methodUpper === 'GET' || methodUpper === 'HEAD') {
        url = generateRequestUrlWithParams(url, options.data)
    } else if (typeof options.data === 'object') {
        // let contentType = options.header && (options.header['Content-Type'] || options.header['content-type'])
        if (contentType && contentType.indexOf('application/json') >= 0) {
            params.body = JSON.stringify(options.data)
        } else if (contentType && contentType.indexOf('application/x-www-form-urlencoded') >= 0) {
            params.body = serializeParams(options.data)
        } else {
            params.body = options.data
        }
    } else {
        params.body = options.data
    }
    if (options.header) {
        params.headers = options.header
    } else {

    }
    if (options.mode) {
        params.mode = options.mode
    }

    let res: IRequestResponse<T> = { data: '', statusCode: 0, header: {} }
    return fetch(url, params)
        .then(response => {
            res.statusCode = response.status
            res.header = {}
            response.headers.forEach((val, key) => {
                res.header[key] = val
            })
            if (options.responseType === 'arraybuffer') {
                return response.arrayBuffer()
            }
            if (options.dataType === 'json' || typeof options.dataType === 'undefined') {
                return response.json()
            }
            if (options.responseType === 'text') {
                return response.text()
            }
            return Promise.resolve(null)
        })
        .then(data => {
            res.data = data
            return res
        })
        .catch(err => {
            return Promise.reject(err)
        })
}