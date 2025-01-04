const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      path: require.resolve('path-browserify'),
      fs: require.resolve('react-native-fs'),
      os: require.resolve('os-browserify'), // Polyfill for os
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
