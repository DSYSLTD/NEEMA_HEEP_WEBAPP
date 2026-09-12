// Central Popup Manager to ensure no two popup forms appear simultaneously

type PopupName = 'cookie_consent' | 'cookie_modal' | 'exit_intent' | 'newsletter' | 'push_optin' | 'quiz_modal' | 'lead_form';

class PopupManager {
  private activePopup: PopupName | null = null;
  private listeners: Set<() => void> = new Set();

  public canShow(name: PopupName): boolean {
    if (this.activePopup === null || this.activePopup === name) {
      return true;
    }
    return false;
  }

  public registerOpen(name: PopupName): boolean {
    if (this.activePopup === null || this.activePopup === name) {
      this.activePopup = name;
      this.notify();
      return true;
    }
    return false;
  }

  public registerClose(name: PopupName): void {
    if (this.activePopup === name) {
      this.activePopup = null;
      this.notify();
    }
  }

  public getActivePopup(): PopupName | null {
    return this.activePopup;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
}

export const popupManager = new PopupManager();
