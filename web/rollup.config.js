import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import { terser } from 'rollup-plugin-terser'
import path from 'path'
import dotenv from 'dotenv'

const production = !process.env.ROLLUP_WATCH
const dotenvResult = dotenv.config({
  path: path.resolve(__dirname, '../.env')
})

if (dotenvResult.error) {
  process.exit(1)
}

export default {
  input: path.resolve(__dirname, 'src/main.js'),
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: path.resolve(__dirname, 'public/bundle.js')
  },
  plugins: [
    svelte({
      dev: !production,
      css: css => {
        css.write(path.resolve(__dirname, 'public/bundle.css'))
      }
    }),
    resolve(),
    replace({
      ...getDotEnvConfig(['HERE_MAP_API', 'HERE_MAP_CODE'])
    }),
    commonjs(),
    production && terser()
  ]
}

function getDotEnvConfig(keys) {
  return keys.reduce((retVal, key) => {
    return {
      ...retVal,
      [`process.env.${key}`]: `"${process.env[key]}"`
    }
  }, {})
}