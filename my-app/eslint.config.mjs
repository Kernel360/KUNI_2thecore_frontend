import nextPlugin from '@next/eslint-plugin-next';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  {
    // 기본 설정
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      globals: {
        // 전역 변수가 필요한 경우 여기에 추가
      },
    },
    // 일반적인 ESLint 규칙 (필요에 따라 추가/수정)
    rules: {
      'indent': ['error', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
  // Next.js 공식 설정 적용
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  // React 플러그인 적용
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // React 17+에서 'react/react-in-jsx-scope' 비활성화 (JSX 변환이 자동으로 처리됨)
      'react/react-in-jsx-scope': 'off',
      // prop-types 검사 비활성화 (TypeScript를 사용한다면 필요 없음)
      'react/prop-types': 'off',
    },
    settings: {
      react: {
        version: 'detect', // 설치된 React 버전을 자동으로 감지
      },
    },
  },
  // TypeScript 파일에 대한 추가 설정 (선택 사항, 필요에 따라 설치)
  // {
  //   files: ['**/*.ts', '**/*.tsx'],
  //   languageOptions: {
  //     parser: '@typescript-eslint/parser',
  //     parserOptions: {
  //       project: './tsconfig.json',
  //     },
  //   },
  //   plugins: {
  //     '@typescript-eslint': tsPlugin,
  //   },
  //   rules: {
  //     ...tsPlugin.configs.recommended.rules,
  //   },
  // },
];
