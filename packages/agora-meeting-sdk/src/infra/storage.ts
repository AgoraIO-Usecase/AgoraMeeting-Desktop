export type AppStorage = Storage | MemoryStorage;

export class MemoryStorage {
  constructor(private readonly _storage = new Map<string, string>()) {}

  getItem(name: string) {
    return this._storage.get(name);
  }

  setItem(name: string, value: string) {
    this._storage.set(name, value);
  }

  removeItem(name: string) {
    this._storage.delete(name);
  }

  clear() {
    this._storage.clear();
  }
}

export class CustomStorage {
  private storage: AppStorage;
  languageKey: string = 'demo_language';
  private keyList: string[] = [];

  constructor() {
    this.storage = new MemoryStorage();
  }

  useSessionStorage() {
    this.storage = window.sessionStorage;
  }

  read(key: string): any {
    try {
      let json = JSON.parse(this.storage.getItem(key) as string);
      return json;
    } catch (_) {
      return this.storage.getItem(key);
    }
  }

  save(key: string, val: any) {
    this.storage.setItem(key, JSON.stringify(val));
    if (this.keyList.indexOf(key) === -1) {
      this.keyList.push(key);
    }
  }

  remove(key: string) {
    this.storage.removeItem(key);
  }

  clear() {
    this.keyList.forEach((name) => {
      this.remove(name);
    });
    this.keyList = [];
  }
}

export const GlobalStorage = new CustomStorage();
