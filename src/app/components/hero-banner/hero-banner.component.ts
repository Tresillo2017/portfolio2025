import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { Subscription } from "rxjs";
import { AccentService } from "src/app/services/accent-service.service";
import { LastfmService } from "src/app/services/lastfm.service";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";
import { isPlatformBrowser } from "@angular/common";
import { BackgroundService } from "@services/background.service";
import {
  trigger,
  transition,
  style,
  animate,
  state,
  group,
} from "@angular/animations";
import JSChristmas from "jschristmas";
const christmas = new JSChristmas();

@Component({
  selector: "hero-banner",
  templateUrl: "./hero-banner.component.html",
  styleUrls: ["./hero-banner.component.scss"],
  animations: [
    trigger("waveAnimation", [
      transition("* => *", [
        style({ transform: "translateX(-100%)" }),
        group([
          animate(
            "1000ms ease-in-out",
            style({ transform: "translateX(100%)" }),
          ),
          animate("500ms ease-out", style({ opacity: 0.5 })),
          animate("500ms 500ms ease-in", style({ opacity: 0 })),
        ]),
      ]),
    ]),
    trigger("fadeAnimation", [
      transition("* => *", [
        style({ opacity: 0, transform: "translateY(10px)" }),
        animate(
          "400ms 300ms ease-out",
          style({
            opacity: 1,
            transform: "translateY(0)",
          }),
        ),
      ]),
    ]),
  ],
})
export class HeroBannerComponent implements OnInit, OnDestroy {
  images: Array<string>;
  heroImage: string;
  secondHeroImage: string | undefined;
  accentSubscription: Subscription;
  isSecondHeroImageActive = false;
  activeIndex: number;
  customImage: string | ArrayBuffer | null = null;

  siteTitle = "TomasPS Portfolio";
  siteDescription: string = "";

  isBrowser: boolean = false;
  externalIcons = [
    {
      icon: "mdi:instagram",
      text: "Instagram",
      link: "https://www.instagram.com/toomas_ps/",
    },
    {
      icon: "mdi:linkedin",
      text: "LinkedIn",
      link: "https://www.linkedin.com/in/tomasps/",
    },
    {
      icon: "mdi:music-circle",
      text: "Tidal",
      link: "https://tidal.com/browse/user/195041547",
    },
  ];

  nowListening: any;
  lastfmSubscription!: Subscription;
  refreshIntervalId!: number;

  constructor(
    private accent: AccentService,
    private lastfmService: LastfmService,
    private translate: TranslateService,
    private backgroundService: BackgroundService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.images = this.accent.images;
    this.heroImage = this.images[this.accent.activeIndex];
    this.activeIndex = Number(this.accent.activeIndex);
    this.customImage = this.accent.customImage;

    this.accentSubscription = this.accent.accentSubscription.subscribe(
      (index: number) => {
        this.setHeroImage(index);
        this.customImage = this.accent.customImage;
      },
    );

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.siteDescription = event.translations["SITE_DESCRIPTION"];
    });

    this.translate.get("SITE_DESCRIPTION").subscribe((res: string) => {
      this.siteDescription = res;
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
      this.fetchNowListening();
      this.refreshIntervalId = window.setInterval(
        () => this.fetchNowListening(),
        60000,
      );

      christmas.snowStorm({
        maxSnowflakes: 100,
        fallSpeed: 1.25,
      });
    }
  }

  ngOnDestroy() {
    this.accentSubscription.unsubscribe();
    if (this.isBrowser) {
      this.lastfmSubscription.unsubscribe();
      clearInterval(this.refreshIntervalId);
    }
  }

  fetchNowListening() {
    this.lastfmSubscription = this.lastfmService
      .getNowListening("tresillo2017")
      .subscribe((data) => {
        this.nowListening = data;
      });
  }

  setHeroImage(index: number) {
    if (this.activeIndex !== index) {
      if (this.isSecondHeroImageActive) {
        this.heroImage =
          index === 0 ? this.images[this.activeIndex] : this.images[index];
        this.isSecondHeroImageActive = false;
      } else {
        this.secondHeroImage =
          index === 0
            ? (this.images[this.activeIndex] as string)
            : this.images[index];
        this.isSecondHeroImageActive = true;
      }
      this.activeIndex = index;

      // Initialize background service with current values
      this.backgroundService.updateImages({
        activeImage: this.heroImage,
        secondaryImage: this.secondHeroImage,
        customImage: this.customImage,
        activeIndex: this.activeIndex,
        isSecondImageActive: this.isSecondHeroImageActive,
      });
    }
  }
}
