import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
export default {
    input: 'src/background.js',
    output: {
        file: 'build/background.js',
        format: 'es'
    },
    plugins: [
        optimizeLodashImports()
    ],
};