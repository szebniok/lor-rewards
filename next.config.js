const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    basePath: isProduction ? "/lor-rewards" : ""
}