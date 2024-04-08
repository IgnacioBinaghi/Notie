import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

export default {
    input: 'src/App.jsx', // Update to your entry file
    output: {
        file: 'bundle.js', // Output file
        format: 'cjs', // Output format (cjs for CommonJS)
    },
    plugins: [
        resolve(), // Resolves node modules
        commonjs(), // Converts CommonJS modules to ES6
        babel({ babelHelpers: 'bundled' }), // Transpile with Babel
    ],
};
