import axios from 'axios';

const BASE_URL = 'https://node-js-backend-h66d.vercel.app/'


export const getResponse = (prompt) => {
    const params = { prompt: prompt };
    return axios.get(BASE_URL + 'getResponse', { params });
}


export const getSummary = (actualSentences, lengthOfSentences) => {
    const body = {
        actualSentences: actualSentences,
        lengthOfSentences: lengthOfSentences,
        apiKeyNumber: 0,
    };

    return axios.post(BASE_URL + 'getSummary', body, { responseType: 'json' })
}

// export const summaryResult = (actualSentences, lengthOfSentences,) =>
//     getSummary(actualSentences, lengthOfSentences).then((response) => response.data);