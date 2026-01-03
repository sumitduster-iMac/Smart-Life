# Contributing to Smart Life

Thank you for your interest in contributing to Smart Life! This document provides guidelines and instructions for contributing to the project.

## 🌟 Ways to Contribute

- Report bugs and issues
- Suggest new features or enhancements
- Improve documentation
- Submit code changes via pull requests
- Help other users in discussions

## 🐛 Reporting Bugs

Before submitting a bug report:
1. Check if the bug has already been reported in [Issues](https://github.com/sumitduster-iMac/Smart-Life/issues)
2. Make sure you're using the latest version
3. Verify the bug is reproducible

When submitting a bug report, include:
- **Description**: Clear description of the issue
- **Steps to Reproduce**: Detailed steps to reproduce the behavior
- **Expected Behavior**: What you expected to happen
- **Actual Behavior**: What actually happened
- **Environment**:
  - macOS version
  - App version
  - Node.js version (if running from source)
- **Screenshots**: If applicable
- **Logs**: Any relevant console or terminal output

## 💡 Suggesting Features

Feature suggestions are welcome! When suggesting a feature:
1. Check existing issues to avoid duplicates
2. Clearly describe the feature and its benefits
3. Explain the use case
4. Provide examples if possible

## 🔧 Development Setup

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Smart-Life.git
   cd Smart-Life
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/sumitduster-iMac/Smart-Life.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 📝 Coding Guidelines

### JavaScript Style
- Use ES6+ features
- Use `const` for constants, `let` for variables
- Use template literals for string interpolation
- Use arrow functions where appropriate
- Add semicolons
- 2-space indentation
- Descriptive variable and function names

### Code Organization
- Keep functions small and focused
- Add comments for complex logic
- Group related functions together
- Use meaningful file names

### Example
```javascript
// Good
const getUserDevices = async () => {
  try {
    const devices = await ipcRenderer.invoke('get-devices');
    return devices.filter(device => device.online);
  } catch (error) {
    console.error('Failed to get devices:', error);
    return [];
  }
};

// Avoid
function a(x){return x.filter(y=>y.b)}
```

### HTML/CSS Style
- Use semantic HTML5 elements
- Use BEM-like class naming
- Keep CSS organized by component
- Use CSS variables for theming
- Maintain accessibility (ARIA labels where needed)

## 🧪 Testing

Before submitting a pull request:
1. Test your changes thoroughly
2. Verify the app builds successfully
3. Check for console errors
4. Test on Intel Mac if possible
5. Ensure no regressions in existing functionality

### Manual Testing Checklist
- [ ] App launches without errors
- [ ] Settings can be saved and loaded
- [ ] UI looks correct and responsive
- [ ] New features work as expected
- [ ] Existing features still work
- [ ] No console errors or warnings
- [ ] App builds successfully

## 📤 Submitting Pull Requests

1. **Update your fork**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes**
   - Follow the coding guidelines
   - Keep commits focused and atomic
   - Write clear commit messages

3. **Test your changes**
   - Verify everything works
   - Check for errors

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: brief description"
   ```

   Commit message format:
   - Use present tense: "Add feature" not "Added feature"
   - First line: brief summary (50 chars or less)
   - Detailed description if needed (after blank line)
   - Reference issues: "Fixes #123" or "Relates to #456"

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Go to GitHub and create a PR
   - Fill in the PR template
   - Link related issues
   - Add screenshots for UI changes

### PR Guidelines
- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Add comments for complex code
- Be responsive to feedback
- Keep PRs up to date with main branch

## 🔍 Code Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge it
4. Your contribution will be included in the next release!

## 📚 Documentation

When adding features or making changes:
- Update README.md if needed
- Update DEVELOPMENT.md for technical changes
- Update INSTALL.md for user-facing changes
- Add entries to CHANGELOG.md
- Add inline code comments for complex logic

## 🎨 UI/UX Guidelines

When working on the interface:
- Maintain consistency with existing design
- Follow macOS Human Interface Guidelines
- Ensure responsive layout
- Test with different window sizes
- Consider accessibility
- Use existing color variables

## 🏗️ Architecture Guidelines

- Keep main and renderer processes separate
- Use IPC for communication between processes
- Store state appropriately (electron-store for persistence)
- Handle errors gracefully
- Log important events
- Keep UI responsive

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Standards
- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior
- Harassment or discriminatory comments
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## 💬 Getting Help

- Read the documentation (README.md, DEVELOPMENT.md)
- Check existing issues and discussions
- Ask questions in GitHub Discussions
- Join community discussions

## 🙏 Recognition

Contributors will be:
- Listed in GitHub contributors
- Mentioned in release notes
- Appreciated in the community!

Thank you for contributing to Smart Life! 🎉
