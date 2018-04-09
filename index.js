const tesseract = require('tesseract.js');
const path = require('path');
const jimp = require('jimp');

(async () => {
    const image = await jimp.read(path.resolve(__dirname, 'shop.png'));
    image.autocrop(false, () => {
        const width = image.bitmap.width;
        const widthAmountToCrop = width * 0.25;
        const widthCropStartingPoint = width - widthAmountToCrop;

        const height = image.bitmap.height;
        const heightCropStartingPoint = height * 0.06;
        const heightAmountToCrop = (height * 0.13) - heightCropStartingPoint;

        image.greyscale();
        image.contrast(-0.76);
        image.crop(widthCropStartingPoint, heightCropStartingPoint, widthAmountToCrop, heightAmountToCrop);
        image.write('yes.png');
        tesseract.recognize(image.bitmap).then((result) => {
            const resultText = result.blocks[0].text;
            const seedRegex = /\n([—-]?[0-9]+)/igm;
            const matches = seedRegex.exec(resultText);

            console.log('resultText', resultText);
            console.log('seedRegex', seedRegex);
            console.log('matches', matches);

            console.log(result);
            if (matches && matches[1]) {
                console.log('==================');
                console.log(matches[1].replace('—', '-'));
                console.log('==================');
            }
        }).finally(() => {
            tesseract.terminate();
        });
    });
})();
