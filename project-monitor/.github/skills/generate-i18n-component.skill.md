---
description: "Generates an Angular component with full i18n support. Forces simultaneous creation of component files (.ts, .html or inline template) AND the corresponding translation keys in assets/i18n/es.json. Use when: creating any new UI component or modifying existing components to add i18n compliance."
tools: [edit, read, execute, search]
---

# Skill: generate-i18n-component

## Purpose

Ensure every Angular component is delivered with complete internationalization support. No text string may exist in a template without a corresponding translation key.

## Workflow

When this skill is invoked, the agent MUST follow these steps in order:

### Step 1 — Identify all user-facing strings
- List every text that will be visible to the user (labels, titles, buttons, placeholders, tooltips, error messages, table headers, empty states).
- Assign a translation key following the pattern: `<feature>.<component>.<element>`

### Step 2 — Create/update the translation file
- File: `src/assets/i18n/es.json`
- Add all keys with their Spanish translations.
- Also add the same keys (with empty strings or English placeholders) to `src/assets/i18n/fr.json` and `src/assets/i18n/en.json`.

### Step 3 — Generate the component
- Import `TranslateModule` in the component's `imports` array (standalone component).
- Use `{{ 'key' | translate }}` in all template positions where text is displayed.
- For attributes (placeholder, title, aria-label), use `[placeholder]="'key' | translate"` or `translate` directive.
- NEVER use string interpolation with hardcoded text.

### Step 4 — Verify
- Run `ng build --configuration=development` to confirm compilation.
- Ensure every key used in the template exists in `es.json`.

## Output Format

Return:
1. List of created/modified files.
2. Full translation key map (key → Spanish value).
3. Any issues or deviations.

## Example

For a component displaying a table with columns "Name", "Version", "Status":

```json
// src/assets/i18n/es.json (excerpt)
{
  "referential": {
    "categories": {
      "title": "Categorías"
    },
    "table": {
      "columnName": "Nombre",
      "columnVersion": "Versión",
      "columnStatus": "Estado",
      "columnActions": "Acciones"
    },
    "actions": {
      "add": "Añadir",
      "edit": "Editar",
      "delete": "Eliminar"
    },
    "placeholder": "Seleccione una categoría para ver las tecnologías"
  }
}
```

```html
<!-- In template -->
<mat-card-title>{{ 'referential.categories.title' | translate }}</mat-card-title>
<th mat-header-cell>{{ 'referential.table.columnName' | translate }}</th>
<button mat-raised-button>{{ 'referential.actions.add' | translate }}</button>
```
