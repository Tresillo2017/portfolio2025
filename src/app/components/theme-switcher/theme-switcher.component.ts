import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { AccentService } from "@services/accent-service.service";
import { IdbService } from "@services/idb.service";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "theme-switcher",
  templateUrl: "./theme-switcher.component.html",
  styleUrls: ["./theme-switcher.component.scss"],
  animations: [
    trigger("modeChange", [
      transition(":enter", [
        style({ opacity: 0, transform: "scale(0.8)" }),
        animate("200ms ease-out", style({ opacity: 1, transform: "scale(1)" })),
      ]),
    ]),
  ],
})
export class ThemeSwitcherComponent implements OnInit {
  themeMode: "dark" | "light" = "light";
  prefersDarkScheme: MediaQueryList | null = null;
  isDarkMode: boolean = false;
  prefersDarkSchemeFromIdb: "dark" | "light" = "light";
  isBrowser: boolean;

  constructor(
    private idb: IdbService,
    private accent: AccentService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.prefersDarkScheme = window.matchMedia(
        "(prefers-color-scheme: dark)",
      );
      this.isDarkMode = this.prefersDarkScheme.matches;
    }
  }

  async ngOnInit(): Promise<void> {
    if (this.isBrowser) {
      try {
        await this.idb.connectToIDB();
        this.prefersDarkSchemeFromIdb = await this.idb.getData(
          "Material You",
          "preferredColorScheme",
        );

        if (this.prefersDarkSchemeFromIdb) {
          this.themeMode = this.prefersDarkSchemeFromIdb;
          this.setThemeMode(this.themeMode);
        } else if (this.isDarkMode && !this.prefersDarkSchemeFromIdb) {
          this.setThemeMode("dark");
        } else {
          this.setThemeMode("light");
        }
      } catch (error) {
        console.error("Error initializing theme:", error);
        // Set default theme if there's an error
        this.setThemeMode("light");
      }
    }
  }

  toggleThemeMode(): void {
    if (this.isBrowser) {
      if (this.themeMode === "light") {
        this.setThemeMode("dark");
      } else {
        this.setThemeMode("light");
      }
    }
  }

  setThemeMode(mode: "light" | "dark"): void {
    if (!this.isBrowser) return;

    switch (mode) {
      case "light":
        document.body.classList.toggle("dark-theme", false);
        document.body.classList.toggle("light-theme", true);
        this.themeMode = "light";
        break;
      case "dark":
        document.body.classList.toggle("dark-theme", true);
        document.body.classList.toggle("light-theme", false);
        this.themeMode = "dark";
        break;
      default:
        console.error("Invalid theme");
    }

    this.accent.setThemeMode(this.themeMode);

    try {
      this.idb.writeToTheme("Material You", {
        preferredColorScheme: this.themeMode,
      });
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  }
}
