import pkg from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
// import { terser } from 'rollup-plugin-terser';

const extensions = ['.ts'];

export default [{
    input: './src/index.ts',
    external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
        replace({
            // include: 'src/**',
            __DEBUG__: process.env.DEBUG === 'true'
        }),
        resolve({ extensions }),
        babel({ extensions, include: ['./src/**/*'] }),
    ],
    output: [
        { file: pkg.module, format: 'es', sourcemap: true },
    ],
    watch: {
        chokidar: {
            usePolling: true
        }
    }
}];