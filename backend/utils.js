const { default: axios } = require("axios");
const { API_URL, API_KEY } = require("./env");

const doAPICall = async (path) => {
  try {
    const URL = API_URL + path;

    const response = await (
      await axios.get(URL, {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      })
    ).data;
    return response;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    return { message: error.message };
  }
};

const getFileLines = (file) => {
    // validate the file format. It has to be a string with specific headers. 
    if (typeof file !== 'string') return null;

    const headers = 'file,text,number,hex';
    if (!file.startsWith(headers)) return null;

    // To get the lines we separate the file on the line breaks and iterate over it, formatting the values into an object
    const lines = file.split('\n').reduce((linesAcc, line) => {
        // Skip the headers and columns with invalid lengths 
        if (line === headers) return linesAcc;
        const columns = line.split(',');
        if (columns.length !== 4) return linesAcc;

        return [...linesAcc, {
            file: columns[0],
            text: columns[1],
            number: columns[2],
            hex: columns[3]
        }];
    }, []);
    return lines
}

module.exports = { doAPICall, getFileLines };
