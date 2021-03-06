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
 * Created by philipp.koepfer on 02.11.16.
 */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var XmlImportService = (function () {
    function XmlImportService(http) {
        this.http = http;
        console.log('XmlImport Service Initialized...');
    }
    XmlImportService.prototype.convertToJson = function (xml) {
        var xmlneu = { name: xml };
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(xml);
        return this.http.post('/api/xmlConverter', JSON.stringify(xmlneu), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    XmlImportService.prototype.convertToXml = function (json) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(xml);
        return this.http.post('/api/jsonConverter', JSON.stringify(json), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    XmlImportService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], XmlImportService);
    return XmlImportService;
}());
exports.XmlImportService = XmlImportService;
//# sourceMappingURL=xmlImport.service.js.map