# White-Label Configuration

This directory contains white-label configurations for the app. Each white-label allows you to customize:

- **App Name & Branding**: App name, slug, bundle identifiers
- **Colors & Themes**: Light and dark theme colors
- **App Icons**: Custom icons for each white-label (icon, splash, adaptive icon, favicon)
- **InstantDB Instance**: Different database instance per white-label
- **App Configuration**: Scheme, owner, EAS project ID, router origin

## Structure

- `default/default.json` - Default white-label configuration (current app)
- `default/icons/` - Default white-label icons
- `example/example.json` - Example template for creating new white-labels
- `.active` - File containing the name of the currently active white-label
- `<name>/<name>.json` - White-label configuration file
- `<name>/icons/` - Directory containing custom icons for each white-label

## Creating a New White-Label

1. Copy the example directory to create a new white-label:
   ```bash
   cp -r whitelabels/example whitelabels/my-brand
   ```

2. Edit the configuration file (`whitelabels/my-brand/my-brand.json`):
   - Update `name`, `slug`, `scheme`
   - Set your `instantDbAppId` (get from https://instantdb.com/dash)
   - Customize `colors` for light and dark themes
   - Update `bundleIdentifier` for iOS and Android
   - Set `easProjectId` if using EAS Build
   - Update `routerOrigin` if needed
   - Customize `branding.welcomeTitle` and other branding text
   - Update `icons` paths if using custom icons

3. (Optional) Add custom icons:
   - Icons directory already exists: `whitelabels/my-brand/icons/`
   - Place your icons: `icon.png`, `splash-icon.png`, `adaptive-icon.png`, `favicon.png`
   - See `whitelabels/default/icons/README.md` for icon specifications

4. Apply the white-label:
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
node whitelabels/scripts/switch-whitelabel.js apply <name>
```

## What Gets Generated

When you apply a white-label, the script:

1. **Copies icons** from `whitelabels/<name>/icons/` to `assets/images/` (if they exist)
2. **Generates `app.json`** - Expo app configuration with your white-label settings
3. **Generates `constants/colors.ts`** - Color constants for light and dark themes
4. **Generates `lib/instant.ts`** - InstantDB configuration with your app ID
5. **Generates `whitelabels/config.json`** - Runtime configuration file

⚠️ **Note**: These files are auto-generated. Do not edit them manually - they will be overwritten when you switch white-labels.

## Runtime Configuration

The app can access white-label configuration at runtime using:

```typescript
import { getWhiteLabelConfig } from '@/whitelabels/lib/whitelabel-runtime';

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
  },
  "icons": {
    "icon": "./assets/images/icon.png",
    "splash": "./assets/images/splash-icon.png",
    "adaptiveIcon": "./assets/images/adaptive-icon.png",
    "favicon": "./assets/images/favicon.png"
  }
}
```

## Icons

Each white-label can have its own set of icons. Place them in `whitelabels/<name>/icons/`:

- `icon.png` - Main app icon (1024x1024px recommended)
- `splash-icon.png` - Splash screen icon
- `adaptive-icon.png` - Android adaptive icon (1024x1024px recommended)
- `favicon.png` - Web favicon (48x48px or 96x96px recommended)

When you switch white-labels, icons from the white-label's `icons` directory will be copied to `assets/images/`. If no custom icons are provided, the default icons will be used.

See `whitelabels/default/icons/README.md` for detailed icon specifications.

## Best Practices

1. **Version Control**: Commit all white-label configs and icons to git, but add `.active` to `.gitignore` if you want per-developer active configs
2. **Testing**: Test each white-label configuration thoroughly before deploying, including icons on both iOS and Android
3. **InstantDB**: Each white-label should have its own InstantDB instance to keep data separate
4. **Builds**: Use different EAS project IDs for different white-labels if you want separate build pipelines
5. **Icons**: Always test icons on actual devices, as they may look different than in design tools

