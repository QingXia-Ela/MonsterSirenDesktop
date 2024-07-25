module.exports = {
  git: {},
  npm: {
    publish: false
  },
  plugins: {
    "@release-it/conventional-changelog": {
      "infile": "CHANGELOG.md",
      "header": "# Changelog",
      "preset": {
        name: "conventionalcommits",
        types: [
          {
            "type": "feat",
            "section": "✨ Feat"
          },
          {
            "type": "fix",
            "section": "🐛 Bug Fixes"
          },
          {
            "type": "init",
            "section": "🛫 Init"
          },
          {
            "type": "docs",
            "section": "📝 Documentation"
          },
          {
            "type": "style",
            "section": "💄 Styles"
          },
          {
            "type": "refactor",
            "section": "♻ Code Refactoring"
          },
          {
            "type": "perf",
            "section": "🚀 Performance Improvements"
          },
          {
            "type": "test",
            "section": "✅ Tests"
          },
          {
            "type": "revert",
            "section": "⏪ Revert"
          },
          {
            "type": "build",
            "section": "👷‍ Build System"
          },
          {
            "type": "chore",
            "section": "🚩 Chore"
          },
          {
            "type": "ci",
            "section": "🔧 Continuous Integration"
          }
        ]
      }
    }
  }
}