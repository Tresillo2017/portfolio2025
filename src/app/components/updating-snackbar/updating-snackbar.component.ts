
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, ViewChild, afterNextRender, inject } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { LoadingCircleComponent } from "@components/loading-circle/loading-circle.component";
import { UpdateService } from '@services/update.service';

@Component({
    selector: 'updating-snackbar',
    imports: [LoadingCircleComponent],
    templateUrl: './updating-snackbar.component.html',
    styleUrl: './updating-snackbar.component.scss'
})
export class UpdatingSnackbarComponent implements AfterViewInit, OnDestroy {
	private sw = inject(SwUpdate);
	private platformId = inject<Object>(PLATFORM_ID);
	private updateService = inject(UpdateService);

	isSpinnerShown = true;
	updateSubscription: Subscription | undefined;
	updateText = "Checking for updates";
	iconText = "";
	isBrowser: boolean = isPlatformBrowser(this.platformId);

	get hasInitiallyCheckedForUpdates(): boolean {
		return this.updateService.hasInitiallyCheckedForUpdates;
	}

	isFadingUp = !this.hasInitiallyCheckedForUpdates ? true : false;
	isFadingDown = false;

	constructor() {
		if (this.isBrowser) {
			this.updateSubscription = this.sw.versionUpdates.subscribe(event => {
				switch (event.type) {
					case 'VERSION_DETECTED':
						// A new version has been detected.
						this.isFadingDown = false;
						this.isFadingUp = true;
						// this.isSpinnerShown = true;
						this.updateText = "Update found! Updating..."
						// this.sw.activateUpdate().then(() => {
							// this.isIconShown = true;
							// this.iconText = "task_alt";
							// this.updateText = "App updated!";
							// console.warn("App updated!")
							// Update activated successfully.
							// setTimeout(() => {
							// 	this.updatingSnackbar.nativeElement.classList.add("fade-in--down");
							// }, 1000);
						// });
						break;
					case 'VERSION_READY':
						// Update is ready to be used.
						// this.isIconShown = true;
						// this.iconText = "new_releases";
						// this.updateText = "Using latest release!";
						// setTimeout(() => {
						// 	this.updatingSnackbar.nativeElement.classList.add("fade-in--down");
						// }, 1000);
						break;
					case 'VERSION_INSTALLATION_FAILED':
						// Update installation failed.
						this.isSpinnerShown = false;
						this.iconText = "report";
						this.updateText = "Update failed! Check console and send a bug report.";
						console.error('Update failed:', event.error);
						break;
					case 'NO_NEW_VERSION_DETECTED':
						this.isSpinnerShown = false;
						this.iconText = "task_alt";
						this.updateText = "Up-to-date!";
						setTimeout(() => {
							this.isFadingDown = true;
						}, 4000);
						break;
				}

				if (!this.hasInitiallyCheckedForUpdates) {
					setTimeout(() => {
						this.updateService.setHasCheckedForUpdates(true);
					}, 5000);
				}
			});
		}
	}

	ngAfterViewInit(): void {
		if (this.isBrowser) {
			setTimeout(() => {
				this.isFadingUp = false;

				if (!this.sw.isEnabled) {
					this.iconText = "report";
					this.updateText = "Updates unavailable";
					console.log("Service worker disabled")
					this.isSpinnerShown = false;
					setTimeout(() => {
						this.isFadingDown = true;
						this.updateService.setHasCheckedForUpdates(true);
					}, 2500);
				}
			}, 1000);
		}
	}

	ngOnDestroy(): void {
		if (this.updateSubscription) {
			this.updateSubscription.unsubscribe();
		}
	}
}
