# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Playwright + TypeScript end-to-end test suite for the public OrangeHRM demo
(`https://opensource-demo.orangehrmlive.com`), covering login, PIM (employee
list/add/edit/delete), and Admin (system users, corporate branding).

## Commands

```bash
npm test                        # run the full suite (headless)
npm run test:headed             # run with a visible browser
npm run test:ui                 # Playwright UI mode
npm run report                  # open the last HTML report
npm run lint                    # ESLint (typescript-eslint + eslint-plugin-playwright)
npm run typecheck               # tsc --noEmit

npx playwright test tests/PIM/addEmployee.spec.ts         # single file
npx playwright test -g "test name substring"              # single test by title
npx playwright test --project=chromium                    # one project only
```

There is no build step; Playwright compiles TypeScript on the fly.

## Architecture

**Page Object Model**, assembled per-test through fixtures rather than
instantiated directly in tests:

- `app/pages/basePage.ts` — `BasePage` (all page objects extend this): `goTo(path)`
  prefixes `BASE_URL` from `utils/config.ts`, plus `waitForPageLoad()`.
- `app/pages/PIMPage/basePIMPage.ts` — `BasePimPage extends BasePage`, adds
  PIM-specific topbar navigation shared by PIM page objects.
- `app/pages/pageManager.ts` — `PageManager` instantiates every page object and
  is exposed to tests as the `pages` fixture (see `app/fixtures/base.fixture.ts`).
  Adding a new page object means registering it here.
- `app/ui/components/` — reusable UI widgets (`CommonTableComponent`,
  `ButtonComponent`, `DropdownComponent`, `AutocompleteComponent`,
  `HeaderComponent`, `LeftSideMenuComponent`), all extending
  `ComponentHolder` (`abstractClasses.ts`). Page objects compose these as
  `readonly` properties (e.g. `PimEmployeeList.table`,
  `AdminUserManagement.dropdown`) instead of duplicating table/dropdown
  locators per page.
- `app/pages/locatorsHelper.ts` — `getElementByLabelText(page, label)` locates
  inputs via OrangeHRM's `.oxd-input-group:has(label:text-is("..."))` pattern,
  since the app's inputs aren't reliably addressable by placeholder/name/id
  alone. Reach for this instead of hand-rolled XPath/CSS when adding locators
  for labeled fields.

**Two fixture entry points** — tests import `test` from whichever fits:

- `app/fixtures/base.fixture.ts` — base fixture adding `pages` (PageManager)
  and `apiClient` (ControllersManager). Use for tests that don't need
  employee-specific API setup/teardown (e.g. `login.spec.ts`,
  `corporateBranding.spec.ts`).
- `app/fixtures/employeeApi.fixtures.ts` — extends the base fixture with
  `createEmployeeByAPI` (auto-creates and auto-deletes a default employee) and
  `deleteEmployeeByAPI` (deletes an employee by number at teardown, for
  employees created via the UI during the test). Use for PIM/Admin tests that
  need an employee to exist.

**API layer** (`app/api/`) is used to set up/tear down test data out-of-band so
UI tests aren't coupled to unrelated UI flows:

- `BaseApiContext` (`app/api/baseApiContext.ts`) reads the session cookie out
  of `playwright/.auth/user.json` (the storage state written by the auth
  setup project) and builds auth headers from it — API calls therefore depend
  on the `setup` project having run first.
- `ControllersManager` aggregates `EmployeeController` and `LeaveController`;
  exposed to tests as the `apiClient` fixture.
- The common pattern in specs: create data via `apiClient` (or the
  `createEmployeeByAPI` fixture), exercise/assert the behavior via `pages.*`,
  then delete via `apiClient` in a `finally` block or let the fixture
  teardown handle it.

**Auth / projects** (`playwright.config.ts`):

- `setup` project runs `tests/auth.setup.ts`, which logs in through the UI and
  saves storage state to `playwright/.auth/user.json`.
- `chromium` project depends on `setup`, reuses that storage state, and runs
  every spec except `tests/login.spec.ts`.
- `unauthenticated_login_tests` project runs only `tests/login.spec.ts`,
  without storage state, since that spec exercises the login form itself.

**Test data**: `test-data/pim/employeeTableTestData.ts` holds expected table
shapes for assertions; `test-data/uploads/pimUploads/` holds fixture files
used for employee-photo upload tests. `utils/credentials.ts` and
`utils/config.ts` hold the (non-secret, public demo) login credentials and
base URL. `utils/date-helpers.ts` wraps `date-fns` for the leave-request date
math.

## Conventions

- Prefer semantic locators (`getByRole`, `getByPlaceholder`, `getByText`) and
  the `getElementByLabelText` helper over raw CSS/XPath; only fall back to
  CSS/XPath when the OrangeHRM markup leaves no semantic hook (several
  existing locators do this already).
- Avoid `page.waitForTimeout(...)` — a few exist in the codebase marked
  `// Temporary solution` and are known debt (`playwright/no-wait-for-timeout`
  is enabled in ESLint but only warns, it won't fail CI). Prefer
  auto-waiting assertions/locators instead when touching this code.
