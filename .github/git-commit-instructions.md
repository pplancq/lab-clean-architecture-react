# Git Commit Instructions

To ensure consistency and readability in commit messages, please follow these guidelines:

## Commit Convention

This project adopts the [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit
messages to ensure a readable history, automate changelog generation, and facilitate continuous integration.

## Main Rules

1. **Follow Conventional Commits**

   Use the following structure for commit messages:

   ```
   <type>[optional scope]: <description>

   [optional body]

   [optional footer(s)]
   ```

    - **type**: The type of change being committed. Use one of the following:
        - `feat`: A new feature
        - `fix`: A bug fix
        - `docs`: Documentation changes
        - `style`: Code style changes (formatting, missing semicolons, etc.)
        - `refactor`: Code refactoring (neither fixes a bug nor adds a feature)
        - `perf`: Performance improvements
        - `test`: Adding or updating tests
        - `build`: Changes that affect the build system or external dependencies (e.g., npm, webpack)
        - `ci`: Changes to CI configuration files and scripts (e.g., GitHub Actions, Travis, Circle)
        - `chore`: Maintenance tasks (e.g., build process, dependencies)
        - `revert`: Reverts a previous commit
    - **scope** (optional): the part of the code concerned (e.g., `appointment`, `unit`, `e2e`, `summary`)
    - **description**: short imperative description, no initial capital letter, no period at the end
    - **first line must not exceed 72 characters**
    - **body** (optional): detailed description of the change, wrapped at 100 characters.
      **You can provide multiple bodies if needed, each separated by a blank line.**
    - **footer(s)** (optional): for breaking changes or issues, use `BREAKING CHANGE:` or `REF #<issue number>`

2. **Best Practices**

    - Use English for all commit messages.
    - One commit = one logical/unit change.
    - Use the scope to specify the affected layer or feature.
    - For breaking changes, add `!` after the type or scope and detail in the commit body.
    - Use the imperative mood in the description (e.g., "add" instead of "added" or "adds").
    - Avoid unnecessary punctuation at the end of the message.

3. **Examples**

    - Simple commit messages should follow the structure:
        - `feat(appointment): add validation appointment`
        - `fix(summary): correct order summary section`
        - `test(unit): add unit tests for validation`
        - `chore: update dependencies`

    - More complex commit messages can include a body and footer:
        - ```
       feat(frontend): add user authentication

       Implement login and logout features.
       Update API calls to use JWT tokens.

       BREAKING CHANGE: authentication is now required for all endpoints.
       ```
        - ```
       refactor(bff): split service layer

       Extracted user and order services into separate files.

       Improves maintainability.

       REF #123
       ```
        - ```
       fix(e2e): correct test setup

       The test database was not seeded correctly.
       Added missing seed script.

       Also fixed a typo in the test runner config.
       ```

## Note

By following these rules, we ensure that our commit history remains clean, consistent, and easy to understand.