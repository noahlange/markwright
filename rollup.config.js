import typescript from 'rollup-plugin-typescript';

export default [
  {
    input: 'src/markwright/index.tsx',
    external: ['react', 'react-promise', 'simple-markdown', 'react-window'],
    output: {
      file: 'dist/markwright.js',
      format: 'esm'
    },
    plugins: [typescript()]
  }
];
