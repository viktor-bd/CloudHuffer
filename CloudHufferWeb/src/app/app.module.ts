import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { ProbeModule } from "./probe/probe.module";
import { RouterModule } from '@angular/router';
import { AppRoutes } from "./app.routes";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ProbeModule, RouterModule.forRoot(AppRoutes)],
  bootstrap: [AppComponent]
})
export class AppModule {}
