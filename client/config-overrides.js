const path = require('path');

module.exports = function override(config) {
  // Add path aliases
  config.resolve.alias = {
    ...config.resolve.alias,
    '@components': path.resolve(__dirname, 'src/components'),
    '@core': path.resolve(__dirname, 'src/components/core'),
    '@ui': path.resolve(__dirname, 'src/components/ui'),
    '@layout': path.resolve(__dirname, 'src/components/layout'),
    '@forms': path.resolve(__dirname, 'src/components/forms'),
    '@hooks': path.resolve(__dirname, 'src/hooks'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@api': path.resolve(__dirname, 'src/services/api'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@constants': path.resolve(__dirname, 'src/utils/constants'),
    '@helpers': path.resolve(__dirname, 'src/utils/helpers'),
    '@styles': path.resolve(__dirname, 'src/styles'),
    '@assets': path.resolve(__dirname, 'src/assets'),
    '@contexts': path.resolve(__dirname, 'src/contexts'),
    '@redux': path.resolve(__dirname, 'src/redux'),
  };
  
  return config;
};