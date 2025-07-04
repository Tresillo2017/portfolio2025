import { isPlatformBrowser } from '@angular/common';
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { AccentService } from '@services/accent-service.service';
import { IdbService } from '@services/idb.service';
import { UpdateService } from '@services/update.service';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@components/footer/footer.component';
import { UpdatingSnackbarComponent } from '@components/updating-snackbar/updating-snackbar.component';
import { EmailCtaComponent } from '@components/resume-request/resume-request.component';
import { SkillListComponent } from '@components/skill-list/skill-list.component';
import { LifeAtAGlanceComponent } from '@components/life-at-a-glance/life-at-a-glance.component';
import { SkillInfoComponent } from '@components/skill-info/skill-info.component';
import { SkillPictureComponent } from '@components/skill-picture/skill-picture.component';
import { OtherSitesComponent } from '@components/other-sites/other-sites.component';
import { ProfileInfoComponent } from '@components/profile-info/profile-info.component';
import { ProfileCardComponent } from '@components/profile-card/profile-card.component';
import { HeroBannerComponent } from '@components/hero-banner/hero-banner.component';
import { ThemeSwitcherComponent } from '@components/theme-switcher/theme-switcher.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [ThemeSwitcherComponent, HeroBannerComponent, ProfileCardComponent, ProfileInfoComponent, OtherSitesComponent, SkillPictureComponent, SkillInfoComponent, LifeAtAGlanceComponent, SkillListComponent, EmailCtaComponent, UpdatingSnackbarComponent, FooterComponent, RouterOutlet]
})
export class HomeComponent {
	private idb = inject(IdbService);
	private accent = inject(AccentService);
	private platformId = inject<Object>(PLATFORM_ID);
	private sw = inject(UpdateService);

	isBrowser: boolean = isPlatformBrowser(this.platformId);

	/** Inserted by Angular inject() migration for backwards compatibility */
	constructor(...args: unknown[]);

	constructor() {
		this.sw.checkForUpdates();

		if (this.isBrowser) {
			this.sw.checkForUpdates();
		}
	}
}
