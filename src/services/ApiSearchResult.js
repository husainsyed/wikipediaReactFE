import axios from 'axios';

const BASE_URL = 'https://en.wikipedia.org/w/api.php?action=opensearch&namespace=0&format=json&origin=*';

const fetchResults = (searchTerm) => {
    const API_URL = `${BASE_URL}&search=${encodeURIComponent(searchTerm)}`;
    return axios.get(API_URL);
};

export const searchResult = (searchTerm) =>
    fetchResults(searchTerm).then((response) => response.data);