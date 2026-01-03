# Security Policy

## Supported Versions

Currently supported versions for security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability in Smart Life, please follow these steps:

### 🚨 For Security Issues

**DO NOT** create a public GitHub issue for security vulnerabilities.

Instead:

1. **Email**: Send details to the repository owner via GitHub's private vulnerability reporting feature
   - Go to the Security tab
   - Click "Report a vulnerability"
   - Fill in the details

2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
   - Your contact information

3. **Response Time**:
   - Initial response: Within 48 hours
   - Status update: Within 7 days
   - Fix timeline: Depends on severity

### 🔒 Security Measures in Place

The Smart Life app implements several security best practices:

#### Data Protection
- **Encrypted Storage**: API credentials are stored using electron-store with encryption
- **No Third-Party Sharing**: Credentials never leave your device except to authenticate with Tuya's official APIs
- **HTTPS Only**: All API communications use HTTPS
- **Local Storage**: All settings stored locally on your Mac

#### Application Security
- **No Remote Code Execution**: App doesn't execute remote code
- **Sandboxed Processes**: Electron processes run with appropriate isolation
- **No Telemetry**: App doesn't send usage data or analytics
- **Open Source**: Code is publicly auditable

#### API Security
- **Secure Communication**: All Tuya API calls over HTTPS
- **Credential Validation**: API keys validated before use
- **No Logging of Secrets**: Sensitive data not logged

### 🛡️ Best Practices for Users

To maintain security:

1. **Keep API Credentials Safe**
   - Don't share your Tuya API keys
   - Don't commit them to version control
   - Rotate keys if compromised

2. **Download from Official Sources**
   - Only download from GitHub releases
   - Verify checksums if provided

3. **Keep Software Updated**
   - Update to the latest version
   - Check for security updates

4. **System Security**
   - Keep macOS updated
   - Use strong device password
   - Enable FileVault encryption

### 🔍 Security Considerations

#### What We Store
- Tuya API credentials (encrypted)
- Device list (locally)
- User preferences (locally)

#### What We DON'T Store
- Personal information
- Device control history
- Usage analytics
- Telemetry data

#### Network Access
The app connects to:
- Tuya Cloud APIs (official endpoints only)
- No other external services
- No ad networks
- No analytics services

### ⚠️ Known Limitations

1. **API Key Storage**: While encrypted, API keys are stored locally. If someone gains physical access to your Mac and your account, they could potentially access the stored keys.

2. **No 2FA**: The app doesn't implement additional 2FA beyond what Tuya provides.

3. **Unsigned App**: The current release is not code-signed, which means:
   - macOS will show security warnings on first launch
   - The app could potentially be modified by malware
   - Users should download only from official sources

### 🔐 Planned Security Enhancements

Future versions may include:
- Code signing with Apple Developer certificate
- Additional encryption layers
- Biometric authentication support
- Security audit logging
- Sandboxing enhancements

### 📋 Security Checklist for Developers

If you're contributing to the project:

- [ ] Never commit API keys or secrets
- [ ] Validate all user input
- [ ] Use parameterized queries/commands
- [ ] Keep dependencies updated
- [ ] Follow OWASP security guidelines
- [ ] Test for common vulnerabilities
- [ ] Use HTTPS for all API calls
- [ ] Sanitize data before display
- [ ] Handle errors without exposing sensitive info
- [ ] Review security implications of changes

### 🔗 Security Resources

- [Electron Security Guidelines](https://www.electronjs.org/docs/latest/tutorial/security)
- [Tuya Security Best Practices](https://developer.tuya.com/en/docs/iot/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [macOS Security](https://support.apple.com/guide/security/welcome/web)

### 📞 Contact

For security concerns:
- Use GitHub's private vulnerability reporting
- Or contact repository maintainers directly through GitHub

### 🙏 Acknowledgments

We appreciate security researchers who help make Smart Life more secure. Responsible disclosure is greatly appreciated.

---

**Last Updated**: January 3, 2026
**Version**: 1.0.0
