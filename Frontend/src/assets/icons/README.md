# assets/icons

This folder is for **custom/brand SVGs only** — your logo, wordmark, or
anything uniquely "Internship Finder" that doesn't exist in a general
icon set. Not for generic UI icons.

## Use lucide-react for generic icons

```bash
npm install
```

`lucide-react` is already in `package.json`. For anything generic
(settings, home, search, building/company, chevrons, etc.), import the
icon component directly instead of an emoji:

```jsx
import { Settings, Home, Building2 } from 'lucide-react';

<Settings className="h-4 w-4 text-gray-400" />
```

Browse the full set at https://lucide.dev/icons

Note: lucide doesn't ship trademarked brand logos (e.g. no official Google
"G"), since icon libraries generally exclude those for trademark reasons.
`Login.jsx`'s "Continue with Google" button currently uses a generic `Mail`
icon as a placeholder — swap it for Google's official sign-in asset
(https://developers.google.com/identity/branding-guidelines) if/when OAuth
is actually implemented, since that button is just a static `alert()` for
now anyway.

## Why not emoji

Emoji (📍🔖⚡⭐) render inconsistently across OS/browser — a teammate on
Windows sees a different glyph than one on macOS, sizing is unpredictable,
and they can't be recolored to match the theme. Prefer `lucide-react`
instead.

## When to actually add a file here

Once the team has a real logo, drop it in as `logo.svg` (full wordmark)
and/or `logo-mark.svg` (icon-only version), then import it like any other
asset:

```jsx
import Logo from '../assets/icons/logo.svg';
```
