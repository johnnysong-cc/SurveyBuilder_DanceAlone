import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutUserComponent } from './components/layout-user/layout-user.component';
import { LayoutAnoComponent } from './components/layout-ano/layout-ano.component';
import { LoginComponent } from './components/login/login.component';
import { RegComponent } from './components/reg/reg.component';
import { QMgmtComponent } from './components/q-mgmt/q-mgmt.component';
import { SMgmtComponent } from './components/s-mgmt/s-mgmt.component';
import { SAnswerComponent } from './components/s-answer/s-answer.component';
import { ExportComponent } from './components/export/export.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutUserComponent,
    LayoutAnoComponent,
    LoginComponent,
    RegComponent,
    QMgmtComponent,
    SMgmtComponent,
    SAnswerComponent,
    ExportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
