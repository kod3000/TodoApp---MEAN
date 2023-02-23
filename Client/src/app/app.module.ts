import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatTableModule} from "@angular/material/table";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";
import {MatDialogModule} from "@angular/material/dialog";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {KodCardModule} from "./components/card/card.module";
import {KodSplashScreenModule} from "./services/splash-screen";
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {TodoModalComponent} from "./components/modal/todo.component";
import { NgIconsModule } from '@ng-icons/core';

import { heroUsers } from '@ng-icons/heroicons/outline';

@NgModule({
  declarations: [
    AppComponent,
    TodoModalComponent
  ],
  imports: [
    BrowserModule,
    NgIconsModule.withIcons({ heroUsers }),
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    KodCardModule,
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    KodSplashScreenModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
