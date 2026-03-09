// commits format: type(scope): description

module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [
        2,
        'always',
        [
            'feat',
            'fix',
            'docs',
            'style',
            'refactor',
            'perf',
            'test',
            'build',
            'ci',
            'chore',
            'revert'
        ],
    ],

    'subject-case': [2, 'always', 'lower-case'],

    'subject-full-stop': [2, 'never', '.'],

    'subject-empty': [2, 'never', '.'],

    'type-empty': [2, 'never'],

    'header-max-length': [2, 'always', 100],

    'body-max-line-length': [2, 'always', 120],

    'scope-case': [2, 'always', 'lower-case'],
  }
}

//