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
/**
 * Created by Paddy on 25.10.2016.
 */
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var tasks_component_1 = require('./components/tasks/tasks.component');
var capacityPlanning_component_1 = require('./components/capacityPlanning/capacityPlanning.component');
var home_component_1 = require('./components/home/home.component');
var xmlImport_component_1 = require('./components/xmlImport/xmlImport.component');
var materialPlanning_component_1 = require('./components/materialPlanning/materialPlanning.component');
var prediction_component_1 = require('./components/prediction/prediction.component');
var workstations_component_1 = require('./components/settings/workstations/workstations.component');
var parts_component_1 = require('./components/settings/parts/parts.component');
var dashboard_component_1 = require('./components/dashboard/dashboard.component');
var partsLists_component_1 = require('./components/overview/partsLists/partsLists.component');
var prio_component_1 = require('./components/prio/prio.component');
var materialPlanningEP_component_1 = require('./components/materialPlanningEP/materialPlanningEP.component');
var warehousestock_component_1 = require('./components/overview/warehousestock/warehousestock.component');
var kPartAllocation_component_1 = require('./components/overview/kPartAllocation/kPartAllocation.component');
var forecast_component_1 = require('./components/forecast/forecast.component');
var xmlExport_component_1 = require('./components/xmlExport/xmlExport.component');
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forRoot([
                    { path: 'prediction', component: prediction_component_1.PredictionComponent },
                    { path: 'xmlImport', component: xmlImport_component_1.XmlImportComponent },
                    { path: 'tasks', component: tasks_component_1.TasksComponent },
                    { path: 'capacityPlanning', component: capacityPlanning_component_1.CapacityPlanningComponent },
                    { path: '', component: home_component_1.HomeComponent },
                    { path: 'materialPlanning', component: materialPlanning_component_1.MaterialPlanningComponent },
                    { path: 'workstations', component: workstations_component_1.WorkstationsComponent },
                    { path: 'parts', component: parts_component_1.PartsComponent },
                    { path: 'dashboard', component: dashboard_component_1.DashboardComponent },
                    { path: 'partsLists', component: partsLists_component_1.PartsListsComponent },
                    { path: 'prioritization', component: prio_component_1.PrioComponent },
                    { path: 'materialPlanningEP', component: materialPlanningEP_component_1.MaterialPlanningEPComponent },
                    { path: 'warehousestock', component: warehousestock_component_1.WarehousestockComponent },
                    { path: 'kpartAllocation', component: kPartAllocation_component_1.KPartAllocationComponent },
                    { path: 'forecast', component: forecast_component_1.ForecastComponent },
                    { path: 'xmlExport', component: xmlExport_component_1.XmlExportComponent }
                ])
            ],
            exports: [
                router_1.RouterModule
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map