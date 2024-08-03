module.exports = function ( api ) {
    api.cache( true );
    return {
        presets: [ 'babel-preset-expo' ],
        plugins: [
            // ...
            // Fix: Export namespace should be first transformed by `@babel/plugin-proposal-export-namespace-from`
            'react-native-reanimated/plugin',
            // '@babel/plugin-proposal-export-namespace-from',
        ],
    };
};

/* Additional Sources
    Export namespace should be first transformed by `@babel/plugin-proposal-export-namespace-from`
    "expo" "Cannot find module 'babel-plugin-r'"

    https://stackoverflow.com/questions/72927722/export-namespace-should-be-first-transformed-by-babel-plugin-proposal-export-n

    https://stackoverflow.com/questions/68972567/error-index-js-cannot-find-module-babel-plugin-r-react-native

    https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation/#babel-plugin
*/
