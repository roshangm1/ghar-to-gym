import fs from 'fs';
import path from 'path';

export interface WhiteLabelConfig {
  name: string;
  slug: string;
  version: string;
  scheme: string;
  owner: string;
  easProjectId: string;
  routerOrigin: string;
  instantDbAppId: string;
  bundleIdentifier: {
    ios: string;
    android: string;
  };
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  branding: {
    welcomeTitle: string;
    splashBackgroundColor: string;
  };
  icons?: {
    icon: string;
    splash: string;
    adaptiveIcon: string;
    favicon: string;
  };
}

const WHITELABELS_DIR = path.join(process.cwd(), 'whitelabels');
const ACTIVE_FILE = path.join(WHITELABELS_DIR, '.active');

/**
 * Get the currently active white-label name
 */
export function getActiveWhiteLabel(): string {
  try {
    const active = fs.readFileSync(ACTIVE_FILE, 'utf-8').trim();
    return active || 'default';
  } catch {
    return 'default';
  }
}

/**
 * Get the config file path for a white-label
 */
function getConfigPath(name: string): string | null {
  // First check in subdirectory (e.g., default/default.json)
  const subdirPath = path.join(WHITELABELS_DIR, name, `${name}.json`);
  if (fs.existsSync(subdirPath)) {
    return subdirPath;
  }
  
  // Fallback to legacy location (e.g., default.json)
  const legacyPath = path.join(WHITELABELS_DIR, `${name}.json`);
  if (fs.existsSync(legacyPath)) {
    return legacyPath;
  }
  
  return null;
}

/**
 * Load a white-label configuration
 */
export function loadWhiteLabelConfig(name?: string): WhiteLabelConfig {
  const whiteLabelName = name || getActiveWhiteLabel();
  const configPath = getConfigPath(whiteLabelName);
  
  if (!configPath) {
    throw new Error(`White-label config "${whiteLabelName}" does not exist`);
  }
  
  try {
    const configContent = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(configContent) as WhiteLabelConfig;
  } catch (error) {
    throw new Error(
      `Failed to load white-label config "${whiteLabelName}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Get all available white-label names
 */
export function getAvailableWhiteLabels(): string[] {
  try {
    const whiteLabels: string[] = [];
    const files = fs.readdirSync(WHITELABELS_DIR);
    
    // Check for config files in subdirectories (e.g., default/default.json, example/example.json)
    for (const file of files) {
      const filePath = path.join(WHITELABELS_DIR, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && file !== 'lib' && file !== 'scripts') {
        const configPath = path.join(filePath, `${file}.json`);
        if (fs.existsSync(configPath)) {
          whiteLabels.push(file);
        }
      } else if (stat.isFile() && file.endsWith('.json') && file !== '.active' && file !== 'config.json') {
        // Legacy support: config files directly in whitelabels/ directory
        whiteLabels.push(file.replace('.json', ''));
      }
    }
    
    return whiteLabels.length > 0 ? whiteLabels : ['default'];
  } catch {
    return ['default'];
  }
}

/**
 * Set the active white-label
 */
export function setActiveWhiteLabel(name: string): void {
  const configPath = getConfigPath(name);
  
  if (!configPath) {
    throw new Error(`White-label config "${name}" does not exist`);
  }
  
  fs.writeFileSync(ACTIVE_FILE, name, 'utf-8');
}

