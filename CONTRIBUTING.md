# Contributing to Clawchan

Thank you for your interest in contributing to Clawchan Intelligence Agency! This document provides guidelines and instructions for contributing.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code:

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Respect different viewpoints

## How to Contribute

### Reporting Bugs

Before creating a bug report, please:

1. Check if the issue already exists
2. Use the latest version
3. Provide detailed information:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (OS, browser, Node version)
   - Screenshots if applicable

### Suggesting Features

Feature requests are welcome! Please:

1. Check if the feature has already been suggested
2. Provide a clear use case
3. Explain why this feature would be useful

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
6. Push to your fork: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker (optional)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/clawchan/agency-dashboard.git
cd agency-dashboard

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

## Project Structure

```
clawchan/
├── frontend/          # React + TypeScript + Three.js
├── backend/
│   ├── nodejs/       # Node.js GraphQL API
│   ├── python/       # Python ML Service
│   ├── go/           # Go API Gateway
│   ├── rust/         # Rust High-Performance Processor
│   ├── java/         # Java Enterprise Service
│   ├── elixir/       # Elixir Real-time Service
│   └── cpp/          # C++ Low-Latency Engine
├── infra/            # Infrastructure as Code
│   ├── terraform/    # AWS/GCP resources
│   ├── kubernetes/   # K8s manifests
│   └── docker/       # Docker configs
├── ml/               # Machine Learning models
├── tests/            # Test suites
└── docs/             # Documentation
```

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use functional components with hooks
- Write tests for all new features

### Python

- Follow PEP 8
- Use type hints
- Document with docstrings
- Use Black for formatting

### Go

- Follow gofmt
- Use meaningful variable names
- Write comprehensive tests
- Document exported functions

### Rust

- Follow rustfmt
- Use clippy for linting
- Write documentation comments
- Ensure no unsafe code warnings

## Testing

### Unit Tests

```bash
# Frontend
npm run test:unit

# Backend Node.js
cd backend/nodejs && npm test

# Python
cd backend/python && pytest

# Go
cd backend/go && go test ./...

# Rust
cd backend/rust && cargo test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

Example:
```
feat(aircraft): add trajectory prediction endpoint

- Implement LSTM model for position prediction
- Add caching with Redis
- Include confidence score in response

Closes #123
```

## Code Review Process

1. All PRs require at least 2 approvals
2. All tests must pass
3. Code coverage must not decrease
4. Documentation must be updated

## Security

If you discover a security vulnerability, please email security@clawchan.io instead of creating a public issue.

## Questions?

Join our Discord: https://discord.gg/clawchan

Or email: dev@clawchan.io

Thank you for contributing! 🦅
