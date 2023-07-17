const axios = require('axios');

class Kladr {
    constructor(opts) {
        this.isFree = !opts || !opts.token;
        this.token = opts ? opts.token : null;
    }

    param(json) {
        const queryString = Object.keys(json).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
        }).join('&');
        return queryString ? '?' + queryString : '';
    }

    buildQuery(query) {
        const queryString = {};

        if (query.ParentType && query.ParentId) {
            queryString[query.ParentType + 'Id'] = query.ParentId;
        }

        for (const key in query) {
            if (key.includes('ParentType') || key.includes('ParentId')) {
                continue;
            }
            queryString[key] = query[key];
        }

        if (!this.isFree) {
            queryString.token = this.token;
        }

        return this.param(queryString);
    }

    async getData(query) {
        if (!query) {
            throw new Error('Запрос не может быть пустым', 'emptyQuery');
        } else if (typeof query !== 'object') {
            throw new Error('Параметры должны иметь тип Object', 'notObject');
        } else if (!query.contentType) {
            throw new Error('Не указан обязательный параметр contentType', 'notContentType');
        }

        const url = `http://${this.isFree ? 'kladr-api.ru' : 'kladr-api.com'}/api.php${this.buildQuery(query)}`;
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            throw new Error(`Request failed with status ${error.response ? error.response.status : 'unknown'}`);
        }
    }
}

module.exports = Kladr;
