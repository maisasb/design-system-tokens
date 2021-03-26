var fs = require('fs');

const convertToSassFile = theme => {
    const designSystemPrefix = '$track-';
    // generate the sass file string
    const output = Object.values(theme).reduce((totalString, category) => {
        totalString += category.reduce((acc, variable, index) => {
            acc += `${designSystemPrefix}${variable.name}: ${variable.value};\n`;

            if (category.length - 1 === index) {
                acc += '\n';
            }

            return acc;
        }, '');

        return totalString;
    }, '');

    // create an output folder
    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    // write the content to a scss file
    fs.writeFile('build/theme.scss', output, err => {
        if (err) console.error('Failed to create theme.scss file');
    });
};

module.exports.convertToSassFile = convertToSassFile