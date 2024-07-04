/* eslint-disable no-param-reassign */
const axios = require('axios');

// Helper function to introduce delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Rate limit settings
const rateLimit = 50;
const interval = 1000; // 1 second in milliseconds
const maxRetries = 5;

let requestQueue = [];
let isProcessing = false;

const processQueue = async () => {
  while (requestQueue.length > 0) {
    const batch = requestQueue.splice(0, rateLimit);

    const responses = await Promise.all(batch.map(req => 
      sendRequestWithRetry(req.config, req.retries)
        .then(response => ({ response, resolve: req.resolve }))
        .catch(error => ({ error, resolve: req.resolve }))
    ));

    responses.forEach(({ response, error, resolve }) => {
      if (response) resolve(response);
      else resolve(Promise.reject(error));
    });

    if (requestQueue.length > 0) {
      await delay(interval);
    }
  }

  isProcessing = false;
};

const addToQueue = (config, retries = 0) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ config, resolve, reject, retries });
    if (!isProcessing) {
      isProcessing = true;
      processQueue();
    }
  });
};

const sendRequestWithRetry = async (config, retries) => {
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries < maxRetries) {
      const retryAfter = parseInt(error.response.headers['retry-after']) * 1000 || interval;
      await delay(retryAfter);
      return sendRequestWithRetry(config, retries + 1);
    } else {
      throw error;
    }
  }
};

module.exports = {
  dataciteApiEvent: (url, headers = {}) => {
    const response = axios({
      url,
      baseURL: 'https://api.datacite.org',
      method: 'get',
      headers: {
        'Content-Type': 'application/json', // TODO datacite prefix api breaks if you include this header
        ...headers,
      },
    });

    return response;
  },
  dataciteApiDoi: (url, headers = {}) => {
    url = `${url}?affiliation=true`;

    const response = axios({
      url,
      baseURL: 'https://api.datacite.org',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    return response;
  },
  crossrefApi: async (url, headers = {}) => {
    const config = {
      url: `${url}/transform/application/vnd.crossref.unixsd+xml`,
      baseURL: 'https://api.crossref.org',
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const response = await addToQueue(config);
    return response;
  },
  // publisherRequest: (url, method, data = {}, headers = {}) => {
  //   const response = axios({
  //     url: `/books/domain-service/${url}`,
  //     method,
  //     data: { ...data },
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: `Basic ${DOMAIN_TOKEN}`,
  //       ...headers,
  //     },
  //   });

  //   return response;
  // },
};
