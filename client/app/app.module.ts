/**
 * Created by Paddy on 21.10.2016.
 */
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule} from '@angular/http';
import { FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { TasksComponent} from './components/tasks/tasks.component';
import { HomeComponent} from './components/home/home.component';
import { AppRoutingModule} from './app-routing.module';

@NgModule({
    imports:      [ BrowserModule, HttpModule, FormsModule, AppRoutingModule],
    declarations: [AppComponent, TasksComponent, HomeComponent],
    bootstrap: [AppComponent]

})
export class AppModule { }
