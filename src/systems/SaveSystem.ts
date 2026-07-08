import {
  MAX_SAFE_COINS,
  MAX_STALL_LEVEL,
  SAVE_FUTURE_TOLERANCE_MS,
  SAVE_KEY,
  SAVE_SCHEMA_VERSION,
  STARTING_COINS,
  STARTING_STALL_LEVEL,
  STARTING_STALL_XP,
} from '../config/constants';
import { clamp } from '../utils/math';
import type {
  GameSnapshot,
  GameSettings,
  LoadedSave,
  SaveGameData,
  UpgradeDefinition,
  UpgradeLevels,
} from '../types/gameTypes';

const CHECKSUM_SALT = 'street-food-empire-local-save-v1';
type SaveChecksumPayload = Omit<SaveGameData, 'checksum'>;
type LegacySaveChecksumPayload = Omit<SaveGameData, 'checksum' | 'settings'>;

export class SaveSystem {
  private readonly upgrades: readonly UpgradeDefinition[];

  constructor(upgrades: readonly UpgradeDefinition[]) {
    this.upgrades = upgrades;
  }

  load(): LoadedSave {
    const defaultSave = this.createDefaultLoadedSave();
    const rawSave = window.localStorage.getItem(SAVE_KEY);

    if (!rawSave) {
      this.save(defaultSave.snapshot);
      return defaultSave;
    }

    let parsedSave: unknown;

    try {
      parsedSave = JSON.parse(rawSave);
    } catch {
      this.save(defaultSave.snapshot);
      return {
        ...defaultSave,
        status: 'reset',
        reason: 'Save JSON was invalid.',
        canGrantOfflineEarnings: false,
      };
    }

    if (!this.isSaveObject(parsedSave)) {
      this.save(defaultSave.snapshot);
      return {
        ...defaultSave,
        status: 'reset',
        reason: 'Save was missing required fields.',
        canGrantOfflineEarnings: false,
      };
    }

    const expectedChecksum = this.createChecksum({
      schemaVersion: parsedSave.schemaVersion,
      coins: parsedSave.coins,
      upgrades: parsedSave.upgrades,
      stallLevel: parsedSave.stallLevel,
      stallXp: parsedSave.stallXp,
      settings: this.repairSettings(parsedSave.settings),
      lastSavedAt: parsedSave.lastSavedAt,
    });
    const legacyChecksum = this.createLegacyChecksum({
      schemaVersion: parsedSave.schemaVersion,
      coins: parsedSave.coins,
      upgrades: parsedSave.upgrades,
      stallLevel: parsedSave.stallLevel,
      stallXp: parsedSave.stallXp,
      lastSavedAt: parsedSave.lastSavedAt,
    });

    // This checksum only detects casual LocalStorage edits. It is not cryptographic
    // anti-cheat because every secret needed to recompute it ships with the client.
    if (parsedSave.checksum !== expectedChecksum && parsedSave.checksum !== legacyChecksum) {
      this.save(defaultSave.snapshot);
      return {
        ...defaultSave,
        status: 'reset',
        reason: 'Save checksum failed.',
        canGrantOfflineEarnings: false,
      };
    }

    const validation = this.validateSave(parsedSave);

    if (!validation.isValid) {
      this.save(validation.loadedSave.snapshot);
      return validation.loadedSave;
    }

    return validation.loadedSave;
  }

  save(snapshot: GameSnapshot): SaveGameData {
    const now = Date.now();
    const repairedSnapshot = {
      coins: this.clampCoins(snapshot.coins),
      upgrades: this.repairUpgradeLevels(snapshot.upgrades),
      stallLevel: this.clampStallLevel(snapshot.stallLevel),
      stallXp: this.clampStallXp(snapshot.stallXp),
      settings: this.repairSettings(snapshot.settings),
    };
    const payloadWithoutChecksum = {
      schemaVersion: SAVE_SCHEMA_VERSION,
      coins: repairedSnapshot.coins,
      upgrades: repairedSnapshot.upgrades,
      stallLevel: repairedSnapshot.stallLevel,
      stallXp: repairedSnapshot.stallXp,
      settings: repairedSnapshot.settings,
      lastSavedAt: now,
    };
    const saveData: SaveGameData = {
      ...payloadWithoutChecksum,
      checksum: this.createChecksum(payloadWithoutChecksum),
    };

    window.localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return saveData;
  }

  reset(): SaveGameData {
    return this.save(this.createDefaultLoadedSave().snapshot);
  }

  private validateSave(saveData: SaveGameData): { isValid: boolean; loadedSave: LoadedSave } {
    const reasons: string[] = [];
    const now = Date.now();
    const repairedCoins = this.clampCoins(saveData.coins);
    const repairedUpgrades = this.repairUpgradeLevels(saveData.upgrades);
    const repairedStallLevel = this.clampStallLevel(saveData.stallLevel);
    const repairedStallXp = this.clampStallXp(saveData.stallXp);
    const repairedSettings = this.repairSettings(saveData.settings);
    let repairedLastSavedAt = saveData.lastSavedAt;

    if (saveData.schemaVersion !== SAVE_SCHEMA_VERSION) {
      reasons.push('schema version mismatch');
    }

    if (repairedCoins !== saveData.coins) {
      reasons.push('coins repaired');
    }

    if (!this.areUpgradeLevelsEqual(repairedUpgrades, saveData.upgrades)) {
      reasons.push('upgrade levels repaired');
    }

    if (repairedStallLevel !== saveData.stallLevel) {
      reasons.push('stall level repaired');
    }

    if (repairedStallXp !== saveData.stallXp) {
      reasons.push('stall progress repaired');
    }

    if (!this.areSettingsEqual(repairedSettings, saveData.settings)) {
      reasons.push('settings repaired');
    }

    if (!Number.isFinite(saveData.lastSavedAt) || saveData.lastSavedAt < 0) {
      repairedLastSavedAt = now;
      reasons.push('timestamp repaired');
    }

    if (saveData.lastSavedAt > now + SAVE_FUTURE_TOLERANCE_MS) {
      repairedLastSavedAt = now;
      reasons.push('future timestamp repaired');
    }

    const isValid = reasons.length === 0;

    return {
      isValid,
      loadedSave: {
        snapshot: {
          coins: repairedCoins,
          upgrades: repairedUpgrades,
          stallLevel: repairedStallLevel,
          stallXp: repairedStallXp,
          settings: repairedSettings,
        },
        lastSavedAt: repairedLastSavedAt,
        status: isValid ? 'loaded' : 'repaired',
        reason: reasons.join(', ') || undefined,
        canGrantOfflineEarnings: true,
      },
    };
  }

  private createDefaultLoadedSave(): LoadedSave {
    return {
      snapshot: {
        coins: STARTING_COINS,
        upgrades: this.createDefaultUpgradeLevels(),
        stallLevel: STARTING_STALL_LEVEL,
        stallXp: STARTING_STALL_XP,
        settings: this.createDefaultSettings(),
      },
      lastSavedAt: Date.now(),
      status: 'default',
      canGrantOfflineEarnings: false,
    };
  }

  private createDefaultUpgradeLevels(): UpgradeLevels {
    return Object.fromEntries(this.upgrades.map((upgrade) => [upgrade.id, 0]));
  }

  private createDefaultSettings(): GameSettings {
    return {
      soundEnabled: true,
    };
  }

  private repairUpgradeLevels(upgradeLevels: UpgradeLevels): UpgradeLevels {
    return Object.fromEntries(
      this.upgrades.map((upgrade) => {
        const migratedId = upgrade.id === 'grill_speed' ? 'grill_speed_1' : upgrade.id;
        const rawLevel = upgradeLevels[upgrade.id] ?? upgradeLevels[migratedId] ?? 0;
        const repairedLevel = Number.isFinite(rawLevel)
          ? Math.round(clamp(rawLevel, 0, upgrade.maxLevel))
          : 0;

        return [upgrade.id, repairedLevel];
      }),
    );
  }

  private clampCoins(coins: number): number {
    return Number.isFinite(coins) ? Math.round(clamp(coins, STARTING_COINS, MAX_SAFE_COINS)) : STARTING_COINS;
  }

  private clampStallLevel(stallLevel: number): number {
    return Number.isFinite(stallLevel)
      ? Math.round(clamp(stallLevel, STARTING_STALL_LEVEL, MAX_STALL_LEVEL))
      : STARTING_STALL_LEVEL;
  }

  private clampStallXp(stallXp: number): number {
    return Number.isFinite(stallXp) ? Math.round(clamp(stallXp, STARTING_STALL_XP, 999_999)) : STARTING_STALL_XP;
  }

  private repairSettings(settings: unknown): GameSettings {
    if (!settings || typeof settings !== 'object') {
      return this.createDefaultSettings();
    }

    const candidate = settings as Partial<GameSettings>;
    return {
      soundEnabled:
        typeof candidate.soundEnabled === 'boolean'
          ? candidate.soundEnabled
          : this.createDefaultSettings().soundEnabled,
    };
  }

  private areUpgradeLevelsEqual(repaired: UpgradeLevels, original: UpgradeLevels): boolean {
    const validIds = new Set(this.upgrades.map((upgrade) => upgrade.id));
    validIds.add('grill_speed_1');
    const originalKeys = Object.keys(original);

    if (originalKeys.some((upgradeId) => !validIds.has(upgradeId))) {
      return false;
    }

    return this.upgrades.every((upgrade) => repaired[upgrade.id] === original[upgrade.id]);
  }

  private areSettingsEqual(repaired: GameSettings, original: unknown): boolean {
    if (!original || typeof original !== 'object') {
      return false;
    }

    const candidate = original as Partial<GameSettings>;
    return repaired.soundEnabled === candidate.soundEnabled;
  }

  private isSaveObject(value: unknown): value is SaveGameData {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<SaveGameData>;
    return (
      typeof candidate.schemaVersion === 'number' &&
      typeof candidate.coins === 'number' &&
      Boolean(candidate.upgrades) &&
      typeof candidate.upgrades === 'object' &&
      typeof candidate.lastSavedAt === 'number' &&
      typeof candidate.checksum === 'string'
    );
  }

  private createChecksum(payload: SaveChecksumPayload): string {
    const stablePayload = JSON.stringify({
      schemaVersion: payload.schemaVersion,
      coins: payload.coins,
      upgrades: Object.keys(payload.upgrades)
        .sort()
        .reduce<UpgradeLevels>((sortedUpgrades, upgradeId) => {
          sortedUpgrades[upgradeId] = payload.upgrades[upgradeId];
          return sortedUpgrades;
        }, {}),
      stallLevel: payload.stallLevel,
      stallXp: payload.stallXp,
      settings: {
        soundEnabled: payload.settings.soundEnabled,
      },
      lastSavedAt: payload.lastSavedAt,
      salt: CHECKSUM_SALT,
    });

    let hash = 2166136261;

    for (let index = 0; index < stablePayload.length; index += 1) {
      hash ^= stablePayload.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16);
  }

  private createLegacyChecksum(payload: LegacySaveChecksumPayload): string {
    const stablePayload = JSON.stringify({
      schemaVersion: payload.schemaVersion,
      coins: payload.coins,
      upgrades: Object.keys(payload.upgrades)
        .sort()
        .reduce<UpgradeLevels>((sortedUpgrades, upgradeId) => {
          sortedUpgrades[upgradeId] = payload.upgrades[upgradeId];
          return sortedUpgrades;
        }, {}),
      stallLevel: payload.stallLevel,
      stallXp: payload.stallXp,
      lastSavedAt: payload.lastSavedAt,
      salt: CHECKSUM_SALT,
    });

    let hash = 2166136261;

    for (let index = 0; index < stablePayload.length; index += 1) {
      hash ^= stablePayload.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16);
  }
}
