"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var task_service_1 = require('./services/task.service');
var capacityPlanning_service_1 = require('./services/capacityPlanning.service');
var app_service_1 = require('./services/app.service');
var translate_service_1 = require('./translate/translate.service');
var xmlImport_service_1 = require('./services/xmlImport.service');
var window_service_1 = require('./services/window.service');
var workstation_service_1 = require('./services/workstation.service');
var part_service_1 = require('./services/part.service');
var session_service_1 = require('./services/session.service');
var db_service_1 = require('./services/db.service');
var materialPlanning_service_1 = require('./services/materialPlanning.service');
var AppComponent = (function () {
    function AppComponent(appService, capacityPlanningService, _translate, materialPlanningService, sessionService, dbService) {
        var _this = this;
        this.appService = appService;
        this.capacityPlanningService = capacityPlanningService;
        this._translate = _translate;
        this.materialPlanningService = materialPlanningService;
        this.sessionService = sessionService;
        this.dbService = dbService;
        this.mobileView = 992;
        this.toggle = false;
        this.language = "de";
        this.attachEvents();
        this.language = (navigator.language || navigator.userLanguage).substring(0, 2);
        this._translate.use(this.language);
        dbService.getResults().subscribe(function (results) {
            if (results.length > 0) {
                var lastResult = results.pop();
                _this.lastPeriod = lastResult.results.period;
                _this.sessionService.setResultObject(lastResult);
            }
        });
    }
    AppComponent.prototype.toggleSidebar = function () {
        this.toggle = !this.toggle;
        this.appService.toggleSidebar(this.toggle);
    };
    AppComponent.prototype.attachEvents = function () {
        var _this = this;
        window.onresize = function () {
            if (_this.getWidth() >= _this.mobileView) {
                if (localStorage.getItem('toggle')) {
                    _this.toggle = !localStorage.getItem('toggle') ? false : true;
                }
                else {
                    _this.toggle = true;
                }
            }
            else {
                _this.toggle = false;
            }
        };
    };
    AppComponent.prototype.getWidth = function () {
        return window.innerWidth;
    };
    AppComponent.prototype.setLang = function (lang) {
        this._translate.use(lang || this.language);
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            templateUrl: 'app.component.html',
            providers: [task_service_1.TaskService, capacityPlanning_service_1.CapacityPlanningService, app_service_1.AppService, translate_service_1.TranslateService,
                xmlImport_service_1.XmlImportService, window_service_1.WindowRef, workstation_service_1.WorkstationService, part_service_1.PartService, session_service_1.SessionService, db_service_1.DBService, materialPlanning_service_1.MaterialPlanningService]
        }), 
        __metadata('design:paramtypes', [app_service_1.AppService, capacityPlanning_service_1.CapacityPlanningService, translate_service_1.TranslateService, materialPlanning_service_1.MaterialPlanningService, session_service_1.SessionService, db_service_1.DBService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map