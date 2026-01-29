---
name: pr-description
description: Generate and create pull requests on GitHub following the project template. Use when asked to "generate a PR", "create a PR", "open a pull request", "create pull request", "write PR description", or "fill PR template". Analyzes git diff, reads linked GitHub issue to verify alignment, fills all template sections, and creates the PR directly on GitHub with user confirmation.
---

# Pull Request Description Generator

Automatically generate comprehensive pull request descriptions that follow the project's PR template (`.github/PULL_REQUEST_TEMPLATE.md`).

## When to Use This Skill

Activate this skill when the user asks to:

- "Generate a PR" or "Create a PR"
- "Open a pull request"
- "Create pull request"
- "Generate a PR description"
- "Fill out the PR template"
- "Write a description for my changes"

## Prerequisites

- Working git repository with commits on a feature branch
- Changes committed to the current branch
- Access to the project's `.github/PULL_REQUEST_TEMPLATE.md` template

## Main Branch Detection

The skill needs to identify the main branch to generate accurate diffs. Follow this priority:

1. **User-provided**: If the user specifies the main branch name (e.g., "main", "master", "develop"), use it
2. **Project instructions**: Check `.github/copilot-instructions.md` for default branch configuration
3. **Git default**: Use `git symbolic-ref refs/remotes/origin/HEAD` to detect the default branch
4. **Fallback**: Default to "main" if detection fails
5. **Ask user**: If uncertain, prompt the user to confirm the main branch name

## Step-by-Step Workflow

### Step 1: Get GitHub Issue Link

If the user hasn't provided a GitHub issue link, **ask for it**:

**Prompt**: "What is the GitHub issue link for this PR? (e.g., https://github.com/owner/repo/issues/123 or just #123)"

**Accepted formats**:

- Full URL: `https://github.com/owner/repo/issues/123`
- Short format: `#123`
- Just number: `123`

### Step 2: Read GitHub Issue

Use the GitHub MCP tools to read the issue content:

```bash
# Extract issue number from the link
# Then use GitHub API to read issue details
```

**Extract from the issue**:

- **Title**: Use as context for PR title
- **Description**: Understand the problem/feature request
- **Acceptance criteria**: Verify if changes align with expected outcome
- **Labels**: Determine type of change (bug, feature, enhancement)
- **Related context**: Any linked PRs, discussions, or references

### Step 3: Identify the Main Branch

Detect or ask for the main branch name using the priority described above.

```bash
# Detect origin's default branch
git symbolic-ref refs/remotes/origin/HEAD | sed 's@^refs/remotes/origin/@@'

# Or list common branches
git branch -r | grep -E 'origin/(main|master|develop)$'
```

### Step 4: Generate Git Diff

Generate a comprehensive diff showing all changes from the main branch:

```bash
git diff $(git merge-base < main-branch > $(git branch --show-current)) $(git branch --show-current)
```

**Parameters**:

- `<main-branch>`: The detected or user-provided main branch (e.g., "main", "master")
- `$(git branch --show-current)`: Current feature branch

**Example**:

```bash
# If main branch is "main"
git diff $(git merge-base main $(git branch --show-current)) $(git branch --show-current)

# If main branch is "develop"
git diff $(git merge-base develop $(git branch --show-current)) $(git branch --show-current)
```

### Step 5: Analyze Changes and Verify Alignment

Review the git diff output to identify changes AND compare with the GitHub issue:

**Technical Analysis**:

1. **Type of change**: Bug fix, feature, breaking change, refactoring, documentation, tests, UI/UX, performance, accessibility
2. **Architecture layers affected**:
   - Domain (entities, value objects, business logic)
   - Application (use cases, ports/interfaces)
   - Infrastructure (repositories, adapters, external services)
   - Presentation (UI components, views, controllers)
3. **File changes**: Count files added, modified, deleted
4. **Key changes**: Extract the most important modifications
5. **Testing requirements**: Identify what types of tests are needed

**Alignment Verification** (compare with GitHub issue):

1. **Does the implementation match the issue objective?**
   - Compare changes with issue description and acceptance criteria
   - Verify all requirements from the issue are addressed
2. **Are there unexpected changes?**
   - Identify changes not mentioned in the issue (scope creep)
   - Flag changes that might need separate issues
3. **Is anything missing?**
   - Check if issue acceptance criteria are fully implemented
   - Note any incomplete requirements

**Report alignment findings**:

- ✅ "Changes fully align with issue #123 objectives"
- ⚠️ "Changes align but include additional modifications: [list]"
- ❌ "Changes do not address issue #123: [explain mismatch]"

If misalignment is detected, inform the user and ask if they want to proceed anyway.

### Step 6: Extract Commit Messages

Get commit messages for context:

```bash
git log --pretty=format:"%s" < main-branch > ..HEAD
```

### Step 7: Fill the PR Template

Read the project's PR template and fill each section:

**Template sections to complete**:

1. **Description**: Concise summary based on GitHub issue objective + implementation details
2. **Related Issue**: Use the GitHub issue link/number obtained in Step 1 (format: `Closes #123`)
3. **Type of Change**: Check applicable boxes based on analysis + issue labels
4. **Changes Made**: List main changes as bullet points
5. **Architecture Layer(s) Affected**: Check applicable Clean Architecture layers
6. **Testing**: Describe test coverage and manual testing steps
7. **Accessibility** (if UI changes): Include keyboard, screen reader, WCAG checks
8. **Screenshots/Videos** (if UI changes): Placeholder for before/after
9. **Browser/Device Testing** (if UI changes): List tested browsers
10. **Performance Impact**: Assess performance implications
11. **Breaking Changes**: Identify any breaking changes
12. **Checklist**: Standard quality checks
13. **Additional Notes**: Any context for reviewers, including alignment verification results

### Step 8: Generate Output

Create the complete PR description in English, with:

- All sections properly filled
- Checkboxes marked where applicable (`- [x]` for completed, `- [ ]` for pending)
- Clear, concise language
- Actionable items for reviewers
- **PR Title**: Derived from GitHub issue title or commit summary

**Present the generated description to the user for review.**

### Step 9: Create Pull Request on GitHub

After presenting the PR description, **ask for user confirmation**:

**Prompt**: "Would you like me to create this pull request on GitHub now?"

**If user confirms (yes)**:

Prepare the PR parameters:

1. Extract repository owner and name from git remote
2. Get current branch name
3. Determine target branch (main branch from Step 3)
4. Prepare PR content:
   - **title**: From GitHub issue title or generated summary
   - **body**: The complete PR description generated in Step 8
   - **head**: Current feature branch
   - **base**: Main branch (e.g., "main", "master", "develop")

Then create the PR using the first available method (in priority order):

#### Method 1: GitHub MCP Server (PRIORITY)

Use GitHub MCP server tools if available:

```javascript
// Use github-mcp-server-create_pull_request tool
create_pull_request({
  owner: 'repository-owner',
  repo: 'repository-name',
  title: 'PR title from issue',
  body: 'Complete PR description',
  head: 'feature/branch-name',
  base: 'main',
});
```

#### Method 2: GitHub CLI (`gh`)

If MCP not available, use GitHub CLI:

```bash
gh pr create \
  --title "Fix user authentication bug" \
  --body "$(cat pr-description.md)" \
  --base main \
  --head feature/fix-auth \
  --repo owner/repo
```

**Verify `gh` is available**:

```bash
gh --version
```

#### Method 3: GitHub REST API (FALLBACK)

If neither MCP nor `gh` are available, use direct REST API:

```bash
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/OWNER/REPO/pulls \
  -d '{
    "title": "PR title",
    "body": "PR description",
    "head": "feature-branch",
    "base": "main"
  }'
```

**Return the created PR URL** to the user (e.g., `https://github.com/owner/repo/pull/456`)

**If user declines (no)**:

- Provide the PR description text for manual creation
- Optionally save to a file (e.g., `pr-description.md`)

## Content Guidelines

### Description Section

- Start with a verb: "Add", "Fix", "Update", "Refactor", "Improve"
- Be specific about what changed and why
- Keep it under 3-4 sentences
- Example: "Add user authentication using JWT tokens. This enables secure API access and session management. Users can now log in, log out, and maintain authenticated sessions."

### Changes Made

- Use bullet points for each major change
- Focus on user-facing or architectural changes
- Group related changes together
- Example:
  ```
  - Implement JWT authentication service
  - Add login/logout UI components
  - Create secure API interceptor for token refresh
  - Update user session state management
  ```

### Testing Section

- Be specific about test coverage
- List manual testing steps in numbered order
- Include edge cases tested
- Example:

  ```
  ### Test Coverage
  - [x] Unit tests added for AuthService
  - [x] Integration tests for login flow
  - [x] Component tests for LoginForm
  - [ ] E2E tests for complete auth flow

  ### Manual Testing
  1. Navigate to login page
  2. Enter valid credentials and submit
  3. Verify successful redirect to dashboard
  4. Log out and verify session cleared
  5. Try invalid credentials and verify error message
  ```

### Accessibility (UI changes only)

- Only fill if PR includes UI changes
- Check each item manually before marking complete
- Provide specific details if issues found
- Example:
  ```
  - [x] Keyboard navigation tested (Tab, Enter, Escape work correctly)
  - [x] Screen reader tested with VoiceOver (all labels announced)
  - [x] WCAG AA contrast verified (4.5:1 minimum for text)
  - [x] Touch targets >= 44x44px (buttons sized appropriately)
  - [x] ARIA labels added for icon buttons
  ```

## Common Patterns

### Bug Fix PR

- Type: Bug fix
- Description: Focus on what was broken and how it's fixed
- Testing: Include reproduction steps for the bug

### Feature PR

- Type: New feature
- Description: Explain the feature's purpose and user benefit
- Screenshots: Show the new UI or functionality
- Testing: Cover happy path and edge cases

### Refactoring PR

- Type: Refactoring
- Description: Explain the architectural improvement
- Testing: Emphasize that behavior remains unchanged

### Breaking Change PR

- Type: Breaking change
- Description: Clearly state what breaks and why it's necessary
- Breaking Changes section: Detail migration steps

## Troubleshooting

| Issue                               | Solution                                                                          |
| ----------------------------------- | --------------------------------------------------------------------------------- |
| GitHub issue not accessible         | Verify issue URL/number is correct; check repository permissions                  |
| Issue content doesn't match changes | Document the mismatch in "Additional Notes" section; ask user if this is expected |
| Git diff is empty                   | Ensure commits exist on current branch; check you're not on main branch           |
| Main branch detection fails         | Manually ask user for main branch name                                            |
| Template file not found             | Confirm `.github/PULL_REQUEST_TEMPLATE.md` exists in repo                         |
| Diff too large to analyze           | Focus on file summaries rather than line-by-line changes                          |
| Uncertain about architecture layer  | Ask user which Clean Architecture layer(s) are affected                           |
| No commit messages available        | Generate description based solely on diff analysis + GitHub issue                 |
| MCP server not available            | Fall back to `gh` CLI or REST API                                                 |
| `gh` CLI not installed              | Check with `gh --version`; fall back to REST API                                  |
| `gh` not authenticated              | Run `gh auth status` and prompt user to authenticate with `gh auth login`         |
| REST API authentication failed      | Verify `GITHUB_TOKEN` environment variable is set                                 |
| PR creation fails                   | Verify branch permissions; check if PR already exists for this branch             |
| User doesn't have write access      | Suggest forking and creating PR from fork                                         |

## Quality Checklist

Before presenting the PR description, verify:

- [ ] GitHub issue read and understood
- [ ] All required template sections are filled
- [ ] Description aligns with GitHub issue objective
- [ ] Any misalignment or scope differences documented
- [ ] Description is clear and concise (under 4 sentences)
- [ ] Type of change boxes are checked accurately (based on issue labels + diff analysis)
- [ ] Architecture layers match the changes
- [ ] Testing section includes both automated and manual tests
- [ ] Accessibility section completed for UI changes
- [ ] Language is English
- [ ] No placeholder text remains (except for screenshots/videos)
- [ ] Issue number correctly referenced (Closes #123)
- [ ] Breaking changes clearly documented if applicable
- [ ] PR title derived from issue or commits

## Example Output

```markdown
# Pull Request

## Description

Add user authentication using JWT tokens and refresh token rotation. This enables secure API access and persistent user sessions. Users can now log in with email/password, and sessions are automatically refreshed without requiring re-login.

## Related Issue

Closes #42

## Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [x] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 🔨 Refactoring (code change that neither fixes a bug nor adds a feature)
- [ ] 📝 Documentation update
- [ ] 🧪 Test update
- [x] 🎨 UI/UX change
- [ ] ⚡ Performance improvement
- [x] ♿ Accessibility improvement

## Changes Made

- Implement JWT authentication service with token refresh logic
- Add LoginForm and LogoutButton UI components
- Create secure API interceptor for automatic token refresh
- Add user session state management with React Context
- Implement protected route wrapper for authenticated pages
- Add "Remember me" functionality with secure token storage

## Architecture Layer(s) Affected

- [ ] Domain (entities, value objects, domain logic)
- [x] Application (use cases, ports/interfaces)
- [x] Infrastructure (repositories, adapters, external services)
- [x] Presentation (UI components, views, controllers)

## Testing

### Test Coverage

- [x] Unit tests added for AuthService and token refresh logic
- [x] Integration tests for login/logout flows
- [x] Component tests for LoginForm with validation
- [ ] E2E tests for complete authentication flow (planned)
- [x] All existing tests pass

### Manual Testing

1. Navigate to /login page
2. Enter valid credentials (test@example.com / password123)
3. Verify successful login and redirect to dashboard
4. Refresh page and verify session persists
5. Log out and verify redirect to login page
6. Test "Remember me" checkbox functionality
7. Test invalid credentials show error message
8. Test session expiration after 1 hour (with clock manipulation)

## Accessibility

- [x] Keyboard navigation tested (Tab through form, Enter to submit, Escape to clear)
- [x] Screen reader tested with VoiceOver (form labels and errors announced correctly)
- [x] WCAG AA contrast verified (button: 7.2:1, text: 12.5:1)
- [x] Touch targets >= 44x44px (login button: 48x48px, checkbox: 44x44px)
- [x] ARIA labels added (error messages linked with aria-describedby)

## Screenshots / Videos

### Before

<!-- No login functionality existed -->

### After

<!-- Add screenshot of login form here -->

## Browser/Device Testing

- [x] Chrome (Desktop) - v120
- [x] Firefox (Desktop) - v121
- [x] Safari (Desktop) - v17
- [x] Mobile Safari (iOS 17)
- [x] Mobile Chrome (Android 14)

## Performance Impact

- [x] No significant performance impact
- [ ] Performance improved
- [ ] Performance regression (explain below)

Initial page load increased by ~15KB (gzipped) due to auth library. Login flow completes in <200ms on average network.

## Breaking Changes

- [x] No breaking changes
- [ ] Breaking changes (describe below)

## Checklist

- [x] Code follows the project's Clean Architecture guidelines
- [x] Code follows the project's style guidelines
- [x] Self-review of code performed
- [x] Comments added for token refresh logic
- [x] Documentation updated (README with auth setup instructions)
- [x] No new warnings or errors introduced
- [ ] Dependent changes merged and published (backend auth endpoints deployed)

## Additional Notes

- Backend API must support JWT refresh tokens (already deployed to staging)
- Token expiration set to 1 hour, refresh token valid for 7 days
- Security: tokens stored in httpOnly cookies, no localStorage usage
- Consider adding 2FA in future iteration

**Alignment Verification**: ✅ All acceptance criteria from issue #42 have been implemented. Additional "Remember me" functionality added as user experience improvement (not in original requirements).
```

## Workflow Summary Diagram

```
User Request: "Generate a PR"
         ↓
Step 1: Ask for GitHub issue link (if not provided)
         ↓
Step 2: Read GitHub issue (title, description, acceptance criteria)
         ↓
Step 3: Detect main branch (main/master/develop)
         ↓
Step 4: Generate git diff from merge-base
         ↓
Step 5: Analyze changes + Verify alignment with issue
         ├─→ ✅ Aligned: Continue
         ├─→ ⚠️ Partially aligned: Document differences, ask to proceed
         └─→ ❌ Misaligned: Warn user, ask to proceed or abort
         ↓
Step 6: Extract commit messages
         ↓
Step 7: Fill PR template (all sections)
         ↓
Step 8: Present PR description to user
         ↓
Step 9: Ask: "Create PR on GitHub now?"
         ├─→ Yes: Try MCP → `gh` CLI → REST API → Return PR URL
         └─→ No: Provide description text for manual creation
```

## PR Creation Methods (Priority Order)

The skill attempts to create the PR using these methods in order:

### 1. GitHub MCP Server (Preferred)

- **Tool**: `github-mcp-server-create_pull_request`
- **Advantages**: Native integration, no CLI dependencies
- **Requirement**: GitHub MCP server must be available

### 2. GitHub CLI (`gh`)

- **Command**: `gh pr create`
- **Advantages**: Widely used, user-friendly
- **Requirement**: `gh` installed and authenticated (`gh auth status`)

### 3. GitHub REST API (Fallback)

- **Method**: Direct HTTP POST to GitHub API
- **Advantages**: Always available with token
- **Requirement**: `GITHUB_TOKEN` environment variable set

## References

- Project PR Template: `.github/PULL_REQUEST_TEMPLATE.md`
- Project Instructions: `.github/copilot-instructions.md`
- Clean Architecture Layers: See project-context.md
- Accessibility Standards: WCAG 2.2 AA guidelines
