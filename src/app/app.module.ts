import { UserRepository } from './services/user.repository';
import { FileRepository } from './services/file.repository';
import { GapiSession } from './services/gapi.session';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig } from '@angular/material';
import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { rootRouterConfig } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { AuthInterceptor } from './shared/services/auth/auth.interceptor';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider, FacebookLoginProvider, AuthService
} from 'angularx-social-login';
import { HtmlContentPopupComponent } from './views/course/html-content-popup/html-content-popup.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider('383090574143-0etpqjvleph6q0s1fb5j2krj7dnqgk3l.apps.googleusercontent.com')
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('633111794166569')
  },
]);
export function provideConfig() {
  return config;
}
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    PerfectScrollbarModule,
    SocialLoginModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(rootRouterConfig, { useHash: true }),
  ],
  declarations: [AppComponent, HtmlContentPopupComponent],
  providers: [
    { provide: AuthServiceConfig, useFactory: provideConfig },
    { provide: ErrorHandler, useClass: ErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
    GapiSession,
    FileRepository,
    UserRepository,
  ],
  entryComponents: [HtmlContentPopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }