import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import filesize from 'rollup-plugin-filesize'

const baseConfig = {
    input: 'src/index.ts',
    plugins: {
      pcalls: [
        nodeResolve(),
        typescript(),
        commonjs(),
        babel({
          babelHelpers: 'bundled',
          sourceMap: true,
          extensions: ['.js', '.ts'],
        }),
        filesize()
      ],
    },
  };
  
function getConfig(package_name, options = {}) {
    let baseConfigUpd = {
        ...baseConfig,
        ...options
    };
    
    const buildFormats = [];
    
    const esConfig = {
        ...baseConfigUpd,
        output: {
            file: 'dist/' + package_name + '.esm.js',
            format: 'esm',
            exports: 'named',
        },
        plugins: [
            ...baseConfigUpd.plugins.pcalls,
            terser({
                output: {
                    ecma: 6,
                },
            }),
        ],
    };
    buildFormats.push(esConfig);

    const umdConfig = {
        ...baseConfigUpd,
        output: {
            compact: true,
            file: 'dist/' + package_name + '.cjs.js',
            format: 'cjs',
            name: package_name,
            exports: 'named',
        },
        plugins: [
            ...baseConfigUpd.plugins.pcalls
        ],
    };
    buildFormats.push(umdConfig);

    const unpkgConfig = {
        ...baseConfigUpd,
        
        output: {
            compact: true,
            file: 'dist/' + package_name + '.min.js',
            format: 'iife',
            name: package_name,
            exports: 'named',
            
        },
        plugins: [
            ...baseConfigUpd.plugins.pcalls,
            terser({
                output: {
                    ecma: 5,
                },
            }),
        ],
    };
    buildFormats.push(unpkgConfig);
    
    return buildFormats;
}

const buildConfig = getConfig('boel');

export default buildConfig;