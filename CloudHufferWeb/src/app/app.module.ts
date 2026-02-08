import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
// ProbeModule no longer used; prefer standalone components under src/app/components
// import { ProbeModule } from "./probe/probe.module";
import { RouterModule } from '@angular/router';
import { AppRoutes } from "./app.routes";
import { provideRouter } from '@angular/router';

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(AppRoutes), AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
