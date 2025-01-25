import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { Router } from "@angular/router";
import { ViewportScroller, isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent implements OnInit {
  isBrowser: boolean;
  footerLinks = [
    {
      icon: "photo_camera",
      link: "https://photography.tomasps.com",
      text: "Photograpgy",
      isExternal: true,
    },
    {
      icon: "public",
      link: "https://tomasps.com/",
      text: "https://tomasps.com",
      isExternal: true,
    },
    {
      icon: "code",
      link: "https://github.com/tresillo2017/portfolio2025",
      text: "Source Code",
      isExternal: true,
    },
    {
      icon: "work",
      link: "https://www.linkedin.com/in/tomasps/",
      text: "linkedin.com/in/tomasps/",
      isExternal: true,
    },
    {
      icon: "privacy_tip",
      link: "/privacy-policy",
      text: "Privacy Policy",
      isExternal: false,
    },
    {
      icon: "policy",
      link: "/terms-of-service",
      text: "Terms of Service",
      isExternal: false,
    },
  ];

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {}

  handleClick(link: string, isExternal: boolean, event: Event) {
    event.preventDefault();
    if (!this.isBrowser) return;

    event.preventDefault();
    if (isExternal) {
      window.open(link, "_blank");
    } else {
      this.router.navigate([link]).then(() => {
        if (this.isBrowser) {
          setTimeout(() => {
            this.viewportScroller.scrollToPosition([0, 0]);
          }, 100);
        }
      });
    }
  }
}
