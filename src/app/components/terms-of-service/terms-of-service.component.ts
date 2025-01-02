import { Component, OnInit, OnDestroy } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { AccentService } from "@services/accent-service.service";
import { BackgroundService } from "@services/background.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-terms-of-service",
  templateUrl: "./terms-of-service.component.html",
  styleUrls: ["./terms-of-service.component.scss"],
})
export class TermsOfServiceComponent implements OnInit, OnDestroy {
  images: Array<string>;
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
  ) {
    this.images = this.accent.images;

    // Initialize background if needed
    this.backgroundService.initializeBackground();
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
