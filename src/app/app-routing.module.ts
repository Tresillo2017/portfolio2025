import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "@components/home/home.component";
import { PrivacyPolicyComponent } from "@components/privacy-policy/privacy-policy.component";
import { TermsOfServiceComponent } from "@components/terms-of-service/terms-of-service.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-of-service", component: TermsOfServiceComponent },
  { path: ".well-known/matrix/server", redirectTo: "assets/.well-known/matrix/server" },
  { path: "**", redirectTo: "" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: "enabledBlocking",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
