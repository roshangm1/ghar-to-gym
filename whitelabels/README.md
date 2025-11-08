# White-Label Configuration

This directory contains white-label configurations for the app. Each white-label allows you to customize:

- **App Name & Branding**: App name, slug, bundle identifiers
- **Colors & Themes**: Light and dark theme colors
- **InstantDB Instance**: Different database instance per white-label
- **App Configuration**: Scheme, owner, EAS project ID, router origin

## Structure

- `default.json` - Default white-label configuration (current app)
- `example.json` - Example template for creating new white-labels
- `.active` - File containing the name of the currently active white-label

## Creating a New White-Label

1. Copy `example.json` to a new file with your white-label name:
   ```bash
   cp whitelabels/example.json whitelabels/my-brand.json
   ```

2. Edit the new file with your configuration:
   - Update `name`, `slug`, `scheme`
   - Set your `instantDbAppId` (get from https://instantdb.com/dash)
   - Customize `colors` for light and dark themes
   - Update `bundleIdentifier` for iOS and Android
   - Set `easProjectId` if using EAS Build
   - Update `routerOrigin` if needed
   - Customize `branding.welcomeTitle` and other branding text

3. Apply the white-label:
   ```bash
   npm run whitelabel:apply my-brand
   ```

## Switching Between White-Labels

Use the npm scripts to manage white-labels:

```bash
# List all available white-labels
npm run whitelabel:list

# Show current active white-label
npm run whitelabel:current

# Switch to a different white-label
npm run whitelabel:apply <name>

# Or use the script directly
node scripts/switch-whitelabel.js apply <name>
```

## What Gets Generated

When you apply a white-label, the script generates:

1. **`app.json`** - Expo app configuration with your white-label settings
2. **`constants/colors.ts`** - Color constants for light and dark themes
3. **`lib/instant.ts`** - InstantDB configuration with your app ID

⚠️ **Note**: These files are auto-generated. Do not edit them manually - they will be overwritten when you switch white-labels.

## Runtime Configuration

The app can access white-label configuration at runtime using:

```typescript
import { getWhiteLabelConfig } from '@/lib/whitelabel-runtime';

const config = getWhiteLabelConfig();
console.log(config.branding.welcomeTitle);
```

## Configuration Schema

Each white-label JSON file should follow this structure:

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

1. **Version Control**: Commit all white-label configs to git, but add `.active` to `.gitignore` if you want per-developer active configs
2. **Testing**: Test each white-label configuration thoroughly before deploying
3. **InstantDB**: Each white-label should have its own InstantDB instance to keep data separate
4. **Builds**: Use different EAS project IDs for different white-labels if you want separate build pipelines

