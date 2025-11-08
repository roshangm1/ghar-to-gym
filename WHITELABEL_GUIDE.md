# White-Label Setup Guide

Your project is now set up for white-labeling! You can easily spin off new apps with different names, themes, colors, and InstantDB instances.

## Quick Start

### 1. List Available White-Labels
```bash
npm run whitelabel:list
```

### 2. Switch to a White-Label
```bash
npm run whitelabel:apply <name>
```

### 3. Check Current White-Label
```bash
npm run whitelabel:current
```

## Creating a New White-Label

1. **Copy the example template:**
   ```bash
   cp whitelabels/example.json whitelabels/my-brand.json
   ```

2. **Edit the configuration file** (`whitelabels/my-brand.json`):
   - Update `name`, `slug`, `scheme`
   - Set your `instantDbAppId` (get from https://instantdb.com/dash)
   - Customize `colors` for light and dark themes
   - Update `bundleIdentifier` for iOS and Android
   - Set `easProjectId` if using EAS Build
   - Update `routerOrigin` if needed
   - Customize `branding.welcomeTitle` and other branding text

3. **Apply the white-label:**
   ```bash
   npm run whitelabel:apply my-brand
   ```

4. **Restart your development server** for changes to take effect.

## What Gets Customized

When you switch white-labels, the following are automatically updated:

- ✅ **App Name & Branding** - Display name, slug, bundle identifiers
- ✅ **Colors & Themes** - Light and dark theme colors
- ✅ **InstantDB Instance** - Different database instance per white-label
- ✅ **App Configuration** - Scheme, owner, EAS project ID, router origin
- ✅ **Welcome Messages** - Branding text in the auth screen

## Generated Files

The following files are auto-generated when you switch white-labels:

- `app.json` - Expo app configuration
- `constants/colors.ts` - Color constants
- `lib/instant.ts` - InstantDB configuration
- `whitelabel-config.json` - Runtime config (for app access)

⚠️ **Do not edit these files manually** - they will be overwritten when you switch white-labels.

## Runtime Access

Access white-label config in your React Native code:

```typescript
import { getWhiteLabelConfig } from '@/lib/whitelabel-runtime';

const config = getWhiteLabelConfig();
console.log(config.branding.welcomeTitle);
console.log(config.name);
```

## Example: Switching Between White-Labels

```bash
# Switch to default
npm run whitelabel:apply default

# Switch to example
npm run whitelabel:apply example

# Check which one is active
npm run whitelabel:current
```

## Configuration Structure

Each white-label JSON file contains:

```json
{
  "name": "App Display Name",
  "slug": "app-slug",
  "version": "1.0.0",
  "scheme": "app-scheme",
  "owner": "expo-owner",
  "easProjectId": "your-eas-project-id",
  "routerOrigin": "https://your-domain.com/",
  "instantDbAppId": "your-instantdb-app-id",
  "bundleIdentifier": {
    "ios": "com.yourcompany.app",
    "android": "com.yourcompany.app"
  },
  "colors": {
    "light": { /* color definitions */ },
    "dark": { /* color definitions */ }
  },
  "branding": {
    "welcomeTitle": "Welcome Message",
    "splashBackgroundColor": "#ffffff"
  }
}
```

## Best Practices

1. **Version Control**: Commit all white-label configs to git
2. **Testing**: Test each white-label configuration thoroughly
3. **InstantDB**: Each white-label should have its own InstantDB instance
4. **Builds**: Use different EAS project IDs for different white-labels

For more details, see `whitelabels/README.md`.

