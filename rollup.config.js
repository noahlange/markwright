import typescript from 'rollup-plugin-typescript';

export default [
  {
    input: 'src/markwright/index.tsx',
    external: ['react', 'react-promise', 'simple-markdown'],
    output: {
      file: 'dist/bundle.js',
      format: 'esm'
    },
    plugins: [typescript()]
  }
];
