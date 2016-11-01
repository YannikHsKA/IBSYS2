import { Component } from '@angular/core';
import { TaskService } from './services/task.service';
import { AppService} from './services/app.service';
import { TranslateService } from './translate/translate.service';


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [TaskService, AppService, TranslateService]
})
export class AppComponent {
    mobileView:number = 992;
    toggle: boolean = false;
    language: string = "de";

    constructor(private appService:AppService, private _translate: TranslateService){
        this.attachEvents();
        this.language = (navigator.language || navigator.userLanguage).substring(0,2);
        this._translate.use(this.language);
    }

    toggleSidebar(){
        this.toggle = !this.toggle;
        this.appService.toggleSidebar(this.toggle);
    }

    attachEvents() {
        window.onresize = ()=> {
            if (this.getWidth() >= this.mobileView) {
                if (localStorage.getItem('toggle')) {
                    this.toggle = !localStorage.getItem('toggle') ? false : true;
                } else {
                    this.toggle = true;
                }
            } else {
                this.toggle = false;
            }
        }
    }

    getWidth() {
        return window.innerWidth;
    }
    setLang(lang){
        this._translate.use(lang || this.language);
    }
}

