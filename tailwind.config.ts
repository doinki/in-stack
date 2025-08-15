import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/{**,.client,.server}/**/*.?(c|m)@(j|t)s?(x)'],
} satisfies Config;
