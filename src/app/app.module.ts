import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { ArticlePreviewComponent } from './article-preview/article-preview.component';
import { FindPasswordValidateComponent } from './find-password-validate/find-password-validate.component';
import { FindPasswordResetComponent } from './find-password-reset/find-password-reset.component';
import { BlackCardComponent } from './black-card/black-card.component';
import { AlbumComponent } from './album/album.component';
import { AlbumDetailComponent } from './album-detail/album-detail.component';
import { WriteArticleComponent } from './write-article/write-article.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { HttpClientModule } from '@angular/common/http';
import {ApiService} from './services/api.service';
import {TokenService} from './services/token.service';
import { DialogComponent } from './dialog/dialog.component';
import {CosService} from './services/cos.service';
import { AlertComponent } from './alert/alert.component';
import {AlertService} from './services/alert.service';


const appRoutes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'password/find/validate', component: FindPasswordValidateComponent},
  {path: 'card/black', component: BlackCardComponent},
  {path: 'album', component: AlbumComponent},
  {path: 'album/:id', component: AlbumDetailComponent},
  {path: 'article/write', component: WriteArticleComponent},
  {path: 'photo/upload', component: UploadPhotoComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NavComponent,
    ArticlePreviewComponent,
    FindPasswordValidateComponent,
    FindPasswordResetComponent,
    BlackCardComponent,
    AlbumComponent,
    AlbumDetailComponent,
    WriteArticleComponent,
    UploadPhotoComponent,
    DialogComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [ApiService, TokenService, CosService, AlertService],
  bootstrap: [AppComponent]
})
export class AppModule { }
