---
name: scaffold-page-object
description: Scaffolds a new Playwright page object plus its matching spec file for this OrangeHRM E2E suite, following the existing Page Object Model conventions (BasePage/BasePimPage, PageManager registration, shared UI components, locatorsHelper, fixture entry points, API-backed setup/teardown). Use this whenever the user wants to add test coverage for a new OrangeHRM screen or tab not yet covered (e.g. a new PIM sub-tab, a new Admin screen, Leave module, Recruitment, etc.), or asks to "add a page object for X" or "write tests for the X page". Don't use it for editing an existing page object's methods or for pure bug fixes in existing specs — only for standing up a new screen's coverage from scratch.
---

# Scaffold a page object + spec

This repo's architecture is documented in `CLAUDE.md` at the repo root — read it
first if you haven't already this session. This skill turns that architecture
into a concrete, repeatable build sequence for a *new* screen, so the result
looks like it was written by someone who already knew the codebase instead of
reinventing a pattern that already exists five files over.

The fastest way to get conventions right is to open a sibling file in the same
family (see "Nearest neighbor" below) and mirror its shape — these components
and base classes evolve, so treat the live files as the source of truth, not
the snippets quoted below.

## 1. Pin down what you're building

Before writing anything, work out:

- **Feature name and OrangeHRM URL path** — e.g. "Leave > Assign Leave" at
  `/leave/assignLeave`. If the user didn't give a path, check the live site's
  nav or ask.
- **Section** — PIM, Admin, Leave, Recruitment, etc. This decides the base
  class (see step 2) and where the file lives.
- **Which shared components it needs** — look at what's actually on the page:
  a results table → `CommonTableComponent`; a save/search/add button →
  `ButtonComponent`; a `<select>`-style OXD dropdown → `DropdownComponent`; a
  type-ahead field → `AutocompleteComponent`. Don't reach for a component the
  page doesn't have, and don't hand-roll a locator for something a component
  already covers (see `app/ui/components/`).
- **Does the test need an employee to already exist?** Most PIM/Admin flows
  do (e.g. assigning a user to an employee, editing an employee record). If
  so, the spec will use the `employeeApi` fixture; if the flow is self-
  contained (login, corporate branding, something with no employee
  dependency), the base fixture is enough.

If any of this is ambiguous from the user's request, ask rather than guessing
the URL or data dependency — guessing a wrong path produces a page object
that compiles but never resolves a selector.

## 2. Nearest neighbor: find the closest existing page object

Don't design the new class in the abstract — find the existing page object
closest to what you're building and use it as the template:

| New screen looks like...                        | Model it on                              |
|--------------------------------------------------|-------------------------------------------|
| A PIM sub-tab with a form + table                 | `app/pages/PIMPage/employeeListPage.ts`    |
| A PIM sub-tab that's mostly a creation form        | `app/pages/PIMPage/addEmployeePage.ts`     |
| An Admin screen with add/search/table              | `app/pages/AdminPage/userManagementPage.ts`|
| A standalone settings-style screen (no PIM topbar) | `app/pages/AdminPage/corporateBrandingPage.ts` |

The PIM vs. non-PIM distinction matters structurally: `BasePimPage`
(`app/pages/PIMPage/basePIMPage.ts`) adds the shared topbar-tab navigation
(`clickTopbarMenuTab`) and `extractEmpNumberFromUrl`, which every PIM screen
needs and nothing outside PIM does. Extend it for anything under the PIM
module; extend plain `BasePage` (`app/pages/basePage.ts`) for Admin/Leave/
other top-level sections.

## 3. Write the page object

Place it under `app/pages/<Section>Page/<name>Page.ts` (matching the existing
`PIMPage/`, `AdminPage/` folders — create a new `<Section>Page/` folder only if
this is a genuinely new top-level section the repo doesn't have yet).

- Extend `BasePimPage` or `BasePage` per step 2.
- For any labeled input (the common case in this app), use
  `getElementByLabelText(this.page, "Label Text")` from
  `app/pages/locatorsHelper.ts` rather than a hand-rolled selector — OrangeHRM
  inputs aren't reliably addressable by placeholder/name/id, which is exactly
  why that helper exists. Fall back to `getByRole`/`getByPlaceholder`/
  `getByText` where those work directly (see `addEmployeePage.ts` for both
  styles side by side), and only drop to raw CSS/XPath when the markup truly
  gives you no semantic hook.
- Compose shared components as `readonly` properties constructed with
  `new XComponent(this.page)` — don't duplicate table/dropdown/autocomplete
  locators on the page object itself. Expose only what the page needs; you
  don't have to wire up every component that exists, only the ones this
  screen actually uses.
- Keep locators `private` unless a spec needs to assert on them directly
  (then make them `readonly`, as `employeeListPage.ts` does with
  `editEmployeeContent`).
- Write the action methods the spec will call (`fillXForm`, `saveX`,
  `searchXByY`, ...) rather than making the spec poke at locators directly —
  the page object is the only thing that should know the DOM shape.
- If the page involves an async fetch that populates a form after it renders
  (common in edit flows), check whether you need to wait on the field's value
  before filling, the way `editEmployeeFullName` does in `employeeListPage.ts`
  — filling before that fetch resolves can get silently clobbered.

## 4. Register it in PageManager

Add the import and a constructor line in `app/pages/pageManager.ts` — a page
object that isn't registered here is invisible to every test, since specs
only ever reach page objects through the `pages` fixture, never by
constructing them directly.

## 5. Pick the fixture entry point for the spec

- No employee dependency → import `test` from `app/fixtures/base.fixture.ts`.
- Needs an employee to exist → import `test` from
  `app/fixtures/employeeApi.fixtures.ts`, which layers `createEmployeeByAPI`
  (auto-creates and auto-deletes a uniquely-named employee) and
  `deleteEmployeeByAPI` (manual teardown for an employee created via the UI
  during the test itself) on top of the base fixture.

This matters for test isolation: this suite runs against OrangeHRM's shared
public demo instance, so anything the test creates (employees, users) has to
be cleaned up afterward or it pollutes every later run against the same
instance (stale rows, duplicate-name autocomplete collisions). Use
`uniqueName()` from `utils/unique.ts` for any name/username your test
generates, the way every existing spec does.

## 6. Write the spec

Place it under `tests/<Section>/<name>.spec.ts`. Follow the shape in
`tests/PIM/addEmployee.spec.ts` or `tests/Admin/userManagement.spec.ts`:

- `test.describe("<Feature>", () => { ... })` wrapping the cases.
- Group multi-stage flows with `test.step(...)` (see
  `userManagement.spec.ts`) when a single test has distinct create/verify/
  cleanup phases — it makes failures legible in the report without needing
  separate tests that would re-pay setup cost.
- Create data via `apiClient`/`createEmployeeByAPI`, exercise it through
  `pages.*`, then delete via `apiClient` (or `deleteEmployeeByAPI`) in a
  `finally` block, so teardown runs even if the assertion in between fails.
  Guard cleanup that depends on the create step having actually succeeded
  (see the `if (empNumber)` guard in `addEmployee.spec.ts`) — don't let a
  failed setup also mask itself behind a failed teardown.
- Prefer the auto-waiting Playwright assertions (`expect(locator).toBeVisible()`,
  `toHaveValue()`, etc.) over manual waits. Never reach for
  `page.waitForTimeout(...)` — if you're tempted to, there's almost always a
  more specific condition to wait on instead (a locator becoming visible, a
  value becoming non-empty, a URL pattern); the handful of existing
  `waitForTimeout` calls in this repo are marked `// Temporary solution` and
  are known debt, not a pattern to extend.

If the new screen needs API support that doesn't exist yet (e.g. a new
controller method to create/delete its backing data), add it to the relevant
controller under `app/api/controllers/` following `employeeController.ts`'s
shape, rather than creating throwaway setup logic inside the spec.

## 7. Verify before handing it back

Run, in this order, and fix anything either one flags:

```bash
npm run lint
npm run typecheck
npx playwright test tests/<Section>/<name>.spec.ts
```

Don't report the scaffold as done on the strength of lint/typecheck alone —
actually run the new spec, since a page object can type-check and still fail
at runtime against the real OrangeHRM markup (wrong label text, a dropdown
option that doesn't match, a table that hasn't finished re-rendering).
