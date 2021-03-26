const fetch = require('node-fetch');

const fetchFigmaFile = () => {
    const headers = { method: 'GET', headers: { 'X-Figma-Token': process.env.FIGMA_API_KEY } };
    const data = fetch(`https://api.figma.com/v1/files/${process.env.FIGMA_ID}`, headers).
        then(res => {
            if (res.status !== 200) {
                console.log('ERROR: ' + res.status)
            }
            return res.json()
        }).catch(error => {
            console.log('ERROR: ' + error)
        });

    return data
};

module.exports.fetchColors = async () => {
    const rgbToHex = (r, g, b) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    const data = await fetchFigmaFile();
    const colorComponents = data.document.children.find(c => c.name === 'Colors').children;

    return colorComponents
        .map(colorCmp => {
            // get the element inside the component for the fill color
            const childElement = colorCmp.children[0];
            const [r, g, b] = Object.values(childElement.fills[0].color).map(value =>
                Number((value * 255).toFixed(0))
            );

            return {
                name: colorCmp.name,
                value: rgbToHex(r, g, b)
            };
        });
};

module.exports.fetchFontSize = async () => {

    const data = await fetchFigmaFile();
    const fontComponents = data.document.children.find(c => c.name === 'FontSize').children;

    return fontComponents.map(fontSize => {
        const childElement = fontSize.children[0];
        return {
            name: fontSize.name,
            value: `${childElement.style.fontSize}px`
        };
    });
};

module.exports.fetchSpacing = async () => {
    const data = await fetchFigmaFile();
    const fontComponents = data.document.children.find(c => c.name === 'Spacing').children;

    return fontComponents.map(spacing => {
        // get the element inside the component for the height prop
        const childElement = spacing.children[0];
        return {
            name: spacing.name,
            // get the height as spacing value
            value: `${childElement.absoluteBoundingBox.height}px`
        };
    });
};

