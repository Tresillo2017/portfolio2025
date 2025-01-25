import { isPlatformBrowser } from "@angular/common";
import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { AccentService } from "@services/accent-service.service";
import { IdbService } from "@services/idb.service";
import { UpdateService } from "@services/update.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  isBrowser: boolean = false;

  constructor(
    private idb: IdbService,
    private accent: AccentService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private sw: UpdateService,
    private translate: TranslateService,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.sw.checkForUpdates();
      this.translate.setDefaultLang("en");
    }
  }

  async ngOnInit() {
    if (this.isBrowser) {
      try {
        await this.idb.connectToIDB();
        const customImage = await this.idb.getData(
          "Material You",
          "customImage",
        );

        if (customImage) {
          this.accent.setCustomImage(customImage, true);
        }

        const accentIndex =
          (await this.idb.getData("Material You", "themeIndex")) || 1;

        if (accentIndex !== "1") {
          this.accent.setAccent(accentIndex);
        }
      } catch (error) {
        console.error("Error initializing browser features:", error);
      }
    }
  }
}
