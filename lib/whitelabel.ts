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
 * Load a white-label configuration
 */
export function loadWhiteLabelConfig(name?: string): WhiteLabelConfig {
  const whiteLabelName = name || getActiveWhiteLabel();
  const configPath = path.join(WHITELABELS_DIR, `${whiteLabelName}.json`);
  
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
    const files = fs.readdirSync(WHITELABELS_DIR);
    return files
      .filter(file => file.endsWith('.json') && file !== '.active')
      .map(file => file.replace('.json', ''));
  } catch {
    return ['default'];
  }
}

/**
 * Set the active white-label
 */
export function setActiveWhiteLabel(name: string): void {
  const configPath = path.join(WHITELABELS_DIR, `${name}.json`);
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`White-label config "${name}" does not exist`);
  }
  
  fs.writeFileSync(ACTIVE_FILE, name, 'utf-8');
}

