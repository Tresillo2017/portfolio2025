import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { AccentService } from "./accent-service.service";

@Injectable({
  providedIn: "root",
})
export class BackgroundService {
  private activeImageSource: BehaviorSubject<string>;
  private secondaryImageSource: BehaviorSubject<string>;
  private customImageSource: BehaviorSubject<string | ArrayBuffer | null>;
  private activeIndexSource: BehaviorSubject<number>;
  private isSecondImageActiveSource: BehaviorSubject<boolean>;

  public activeImage$;
  public secondaryImage$;
  public customImage$;
  public activeIndex$;
  public isSecondImageActive$;

  constructor(private accentService: AccentService) {
    // Initialize BehaviorSubjects
    this.activeImageSource = new BehaviorSubject<string>(
      this.accentService.images[this.accentService.activeIndex],
    );
    this.secondaryImageSource = new BehaviorSubject<string>("");
    this.customImageSource = new BehaviorSubject<string | ArrayBuffer | null>(
      this.accentService.customImage,
    );
    this.activeIndexSource = new BehaviorSubject<number>(
      Number(this.accentService.activeIndex),
    );
    this.isSecondImageActiveSource = new BehaviorSubject<boolean>(false);

    // Initialize observables
    this.activeImage$ = this.activeImageSource.asObservable();
    this.secondaryImage$ = this.secondaryImageSource.asObservable();
    this.customImage$ = this.customImageSource.asObservable();
    this.activeIndex$ = this.activeIndexSource.asObservable();
    this.isSecondImageActive$ = this.isSecondImageActiveSource.asObservable();
  }

  updateImages(data: {
    activeImage: string;
    secondaryImage?: string;
    customImage?: string | ArrayBuffer | null;
    activeIndex: number;
    isSecondImageActive: boolean;
  }) {
    this.activeImageSource.next(data.activeImage);
    this.secondaryImageSource.next(data.secondaryImage || "");
    this.customImageSource.next(data.customImage || null);
    this.activeIndexSource.next(data.activeIndex);
    this.isSecondImageActiveSource.next(data.isSecondImageActive);
  }

  initializeBackground() {
    if (!this.activeImageSource.value) {
      this.updateImages({
        activeImage: this.accentService.images[this.accentService.activeIndex],
        customImage: this.accentService.customImage,
        activeIndex: Number(this.accentService.activeIndex),
        isSecondImageActive: false,
      });
    }
  }
}
