import { isPlatformBrowser } from "@angular/common";
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AccentService } from "@services/accent-service.service";
import { BackgroundService } from "@services/background.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from "@angular/animations";

@Component({
  selector: "app-terms-of-service",
  templateUrl: "./terms-of-service.component.html",
  styleUrls: ["./terms-of-service.component.scss"],
  animations: [
    trigger("fadeInUp", [
      transition(":enter", [
        style({
          opacity: 0,
          transform: "translateY(20px)",
        }),
        animate(
          "400ms ease-out",
          style({
            opacity: 1,
            transform: "translateY(0)",
          }),
        ),
      ]),
    ]),
    trigger("staggerList", [
      transition(":enter", [
        query("li", [
          style({
            opacity: 0,
            transform: "translateX(-20px)",
          }),
          stagger(100, [
            animate(
              "300ms ease-out",
              style({
                opacity: 1,
                transform: "translateX(0)",
              }),
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class TermsOfServiceComponent implements OnInit, OnDestroy {
  images: Array<string> = [];
  isBrowser: boolean;
  heroImage: string = "";
  secondHeroImage: string | undefined;
  isSecondHeroImageActive = false;
  activeIndex: number = 1;
  customImage: string | ArrayBuffer | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private translate: TranslateService,
    private accent: AccentService,
    private backgroundService: BackgroundService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.images = this.accent.images;
      this.backgroundService.initializeBackground();
      this.translate.setDefaultLang("en"); // Move translation init here
    }
  }

  goBack(): void {
    this.router.navigate(["/"]);
  }

  ngOnInit(): void {
    // Subscribe to background service updates
    this.subscriptions.push(
      this.backgroundService.activeImage$.subscribe((image) => {
        this.heroImage = image;
      }),

      this.backgroundService.secondaryImage$.subscribe((image) => {
        this.secondHeroImage = image;
      }),

      this.backgroundService.customImage$.subscribe((image) => {
        this.customImage = image;
      }),

      this.backgroundService.activeIndex$.subscribe((index) => {
        this.activeIndex = index;
      }),

      this.backgroundService.isSecondImageActive$.subscribe((isActive) => {
        this.isSecondHeroImageActive = isActive;
      }),
    );

    // Subscribe to accent changes
    this.subscriptions.push(
      this.accent.accentSubscription.subscribe((index: number) => {
        this.backgroundService.updateImages({
          activeImage: this.accent.images[index],
          customImage: this.accent.customImage,
          activeIndex: index,
          isSecondImageActive: false,
        });
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
