# Contributing Guide

Thank you for your interest in contributing to our project! We appreciate your time and effort. This guide will help you get started with contributing to our Node.js and TypeScript-based open-source project.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Setting Up the Project](#setting-up-the-project)
3. [Making Contributions](#making-contributions)
   - [Reporting Issues](#reporting-issues)
   - [Submitting Pull Requests](#submitting-pull-requests)
4. [Code Standards](#code-standards)
5. [Testing](#testing)
6. [License](#license)
7. [Code of Conduct](#code-of-conduct)

---

## Getting Started

Before contributing, please:
- Read this guide thoroughly.
- Familiarize yourself with the project's [README.md](README.md).
- Check the [open issues](https://github.com/ariessolutionsio/shop-assist) to see if your contribution is already being worked on.

---

## Setting Up the Project

To set up the project locally, follow these steps:

1. **Fork the repository** on GitHub.
2. **Clone your fork** to your local machine:
   ```bash
   git clone https://github.com/ariessolutionsio/shop-assist
   cd shop-assist
   ```

   In [README.md](README.md) you can find the instructions to run the project.

## Making Contributions
### Reporting Issues
If you find a bug or have a feature request, please:

1. Check the issues page to see if it has already been reported.
2. If not, open a new issue with:
   - A clear and descriptive title.
   - Steps to reproduce the issue.
   - Expected vs. actual behavior.

Screenshots, logs, or code snippets (if applicable).

 ### Submitting Pull Requests
To contribute code:

1. Create a new branch for your feature or bugfix:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and ensure they follow the Code Standards.

3. Write tests for your changes (if applicable).

4. Commit your changes with a clear and descriptive commit message:

```bash
git commit -m "feat: add new feature XYZ"
```

5. Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request (PR) against the main branch of the original repository.
- Provide a clear title and description of your changes.
- Reference any related issues (e.g., Fixes #123).


### Code Standards
To maintain consistency across the project, please adhere to the following standards:

- TypeScript: Use TypeScript best practices, including type safety and interfaces.
- Linting: Run the linter before committing:

```bash
npm run lint
```

- Formatting: Run the formatter before committing:

```bash
npm run format
```
- Documentation: Update the documentation as needed.
- Commit Messages: Use clear and descriptive commit messages. Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

#### Conventional Commits Specification
A commit message consists of a header, an optional body, and an optional footer. The header has a specific format:

```
<type>[optional scope]: <subject>
```

The header is the most important part and follows this format:

- type: Describes the purpose of the commit (e.g., feat, fix, docs, etc.).
- [optional scope]: Specifies the part of the codebase affected (e.g., api, ui, auth).
- description: A concise summary of the changes.

#### Commit Types
Here are the most commonly used commit types:

- feat: A new feature.
- fix: A bug fix.
- docs: Documentation-only changes (e.g., README, comments).
- style: Changes that do not affect the meaning of the code (e.g., formatting).
- refactor: Code changes that neither fix a bug nor add a feature (e.g., restructuring).
- test: Adding or modifying tests.
- chore: Maintenance tasks (e.g., updating dependencies, CI/CD config).
ci	Changes to CI/CD configuration files and scripts.
build	Changes that affect the build system or external dependencies.
perf	Performance improvements.
- revert	Reverts a previous commit.


## Testing
To ensure the project works as expected, please:
- Write unit tests for new features or bug fixes using a testing Jest framework.
- Run the tests:

```bash
npm run test
```

## License
By contributing to this project, you agree to license your contributions under the [GNU License](LICENSE).

## Code of Conduct
Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project, you agree to abide by its terms.
