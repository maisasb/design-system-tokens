require('dotenv').config();
const { fetchColors, fetchFontSize, fetchSpacing } = require('./src/figmaHelper');
const { convertToSassFile } = require('./src/generateHelper');

const processFigmaFiles = async () => {

    const theme = {
        colors: await fetchColors(),
        fontSizes: await fetchFontSize(),
        spacings: await fetchSpacing()

    };

    convertToSassFile(theme);
};

processFigmaFiles();