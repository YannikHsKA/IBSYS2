/**
 * Created by Paddy on 13.11.2016.
 */
import {Component, ViewChild} from '@angular/core';
import {Part} from '../../../model/part';
import {PartService} from '../../../services/part.service';
import {
    IMultiSelectOption,
    IMultiSelectSettings,
    IMultiSelectTexts
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {Workstation} from "../../../model/workstastion";
import {ProcessingTime} from "../../../model/processingTime";
import {SessionService} from '../../../services/session.service';
import {TranslatePipe} from '../../../translate/translate.pipe';

@Component({
    moduleId: module.id,
    selector: 'parts',
    templateUrl: 'parts.component.html'
})

export class PartsComponent {
    @ViewChild('modalPartExists')
    modalPartExists: ModalComponent;
    @ViewChild('modalPartEmpty')
    modalPartEmpty: ModalComponent;

    private typOptions: IMultiSelectOption[];
    private verwOptions: IMultiSelectOption[];
    private nextWsOptions: IMultiSelectOption[] = Array<IMultiSelectOption>();
    private typSettings: IMultiSelectSettings;
    private verwSettings: IMultiSelectSettings;
    private nextWsSettings: IMultiSelectSettings;
    private multiSelectTexts: IMultiSelectTexts;

    part: Part = new Part();
    parts: Part[];
    workstations: Workstation[];
    processingTimes: ProcessingTime[];

    ruestZeit: number[] = Array<number>();
    fertigungsZeit: number[] = Array<number>();
    checkedAP: boolean[] = Array<boolean>();

    anzahl: number[] = Array<number>();
    checkedParts: boolean[] = Array<boolean>();

    nextArbeitsplaetze: any = Array<Array<number>>();

    lastId: string;
    procTimeIds: string[] = new Array<string>();

    searchText: any;

    constructor(private partservice: PartService, private sessionService: SessionService, private window: Window, private translatePipe:TranslatePipe) {
        if (this.sessionService.getWorkstations() != null || this.sessionService.getWorkstations() != undefined ||
            this.sessionService.getParts() != null || this.sessionService.getParts() != undefined ||
            this.sessionService.getProcessingTimes() != null || this.sessionService.getProcessingTimes() != undefined) {
            this.workstations = this.sessionService.getWorkstations();
            this.parts = this.sessionService.getParts();
            this.processingTimes = this.sessionService.getProcessingTimes();
            this.initLists();
        }
        else {
            this.partservice.getWorkstationsAndPartsAndBearbeitung()
                .subscribe(data => {
                        this.workstations = data[0]
                        this.parts = data[1]
                        this.processingTimes = data[2]
                    },
                    err => console.error(err),
                    () => this.initLists());
        }

    }

    initLists() {
        this.initMultiSelects();
        this.initCheckboxes();
    }

    initMultiSelects() {
        this.typOptions = [
            {id: 1, name: 'P'},
            {id: 2, name: 'E'},
            {id: 3, name: 'K'}
        ];
        this.verwOptions = [
            {id: 1, name: 'K'},
            {id: 2, name: 'D'},
            {id: 3, name: 'H'}
        ];
        for (let ws of this.workstations) {
            this.nextWsOptions.push({id: ws.nummer, name: ws.nummer.toString()});
        }

        this.typSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: false,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '100px',
        };
        this.verwSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 3,
            closeOnSelect: false,
            showCheckAll: true,
            showUncheckAll: true,
            dynamicTitleMaxItems: 3,
            maxHeight: '300px',
        };
        this.nextWsSettings = {
            pullRight: false,
            enableSearch: true,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: false,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '300px',
        };
        this.multiSelectTexts = {
            checkAll: this.translatePipe.transform('combo_checkAll', null),
            uncheckAll: this.translatePipe.transform('combo_uncheckAll', null),
            checked: this.translatePipe.transform('combo_checked', null),
            checkedPlural: this.translatePipe.transform('combo_checkedPlural', null),
            searchPlaceholder: this.translatePipe.transform('combo_searchPlaceholder', null),
            defaultTitle: this.translatePipe.transform('combo_defaultTitle', null),
        };
    }

    initCheckboxes() {
        for (var ws of this.workstations) {
            this.checkedAP[ws.nummer] = false;
        }
        for (var part of this.parts) {
            this.checkedParts[part.nummer] = false;
        }
    }

    updateCheckedStatus(mode, item) {
        if (mode == 1) {
            this.checkedAP[item.nummer] = !this.checkedAP[item.nummer];
        }
        if (mode == 2) {
            this.checkedParts[item.nummer] = !this.checkedParts[item.nummer];
        }
    }

    updatePart(event) {
        event.preventDefault();
        var bereitsVorhanden = false;
        var verwendung = [];
        var bestandteile = [];
        var typ;

        for (let pts of this.parts) {
            if (pts.nummer == this.part.nummer && pts._id != this.part._id) {
                bereitsVorhanden = true;
            }
        }
        if (!bereitsVorhanden) {
            if (this.part.typ) {
                typ = this.part.typ[0] == "1" ? "P" : this.part.typ[0] == "2" ? "E" : "K";
            }
            if (this.part.verwendung) {
                for (var verw of this.part.verwendung) {
                    verwendung.push(verw == "1" ? "K" : verw == "2" ? "D" : "H")
                }
                verwendung = verwendung.sort((s1, s2) => {
                    if (s1 > s2) {
                        return 1;
                    }
                    if (s1 < s2) {
                        return -1;
                    }
                    return 0;
                })
            }
            if (typ == "P" || typ == "E") {
                for (var i = 0; i < this.checkedParts.length - 1; i++) {
                    if (this.checkedParts[i]) {
                        bestandteile.push({
                            _id: this.parts.find(part => part.nummer == i)._id,
                            anzahl: this.anzahl[i] ? this.anzahl[i] : 0
                        });
                    }
                }
            }

            if (!this.part._id) {
                var newPart: Part = {
                    nummer: this.part.nummer,
                    bezeichnung: this.part.bezeichnung,
                    verwendung: verwendung,
                    typ: typ,
                    wert: this.part.wert,
                    lagerMenge: this.part.lagerMenge,
                    bestandteile: bestandteile,
                    lieferfrist: this.part.lieferfrist ? this.part.lieferfrist : null,
                    abweichung: this.part.abweichung ? this.part.abweichung : null,
                    diskontmenge: this.part.diskontmenge ? this.part.diskontmenge : null
                }
                if(!this.isEmpty(newPart)) {
                    this.partservice.addPart(newPart)
                        .subscribe(part => {
                                this.parts.push(part);
                                this.lastId = part._id;
                            }
                            ,
                            err => console.error(err),
                            () => {
                                typ != "K" ? this.deleteProcessingTimes() : this.resetAll()
                            });
                }
                else{
                    this.modalPartEmpty.open();
                }
            }

            else {
                var _part: Part = {
                    _id: this.part._id,
                    nummer: this.part.nummer,
                    bezeichnung: this.part.bezeichnung,
                    verwendung: verwendung,
                    typ: typ,
                    wert: this.part.wert,
                    lagerMenge: this.part.lagerMenge,
                    bestandteile: bestandteile,
                    lieferfrist: this.part.lieferfrist ? this.part.lieferfrist : null,
                    abweichung: this.part.abweichung ? this.part.abweichung : null,
                    diskontmenge: this.part.diskontmenge ? this.part.diskontmenge : null
                }
                if(!this.isEmpty(newPart)) {
                    this.partservice.updatePart(_part)
                        .subscribe(data => {
                                for (var i = 0; i < this.parts.length; i++) {
                                    if (this.parts[i]._id == _part._id) {
                                        this.parts[i] = _part;
                                    }
                                }
                                ;
                                this.sessionService.setParts(this.parts);
                                this.lastId = _part._id;
                            },
                            err => console.error(err),
                            () => {
                                typ != "K" ? this.deleteProcessingTimes() : this.resetAll()
                            });
                }
                else{
                    this.modalPartEmpty.open();
                }
            }
        }
        else {
            this.modalPartExists.open();
        }
    }

    deleteProcessingTimes() {
        if (this.procTimeIds.length > 0) {
                this.partservice.deleteProcessingTimes(this.procTimeIds)
                    .subscribe(data => {
                        if(data.n == this.procTimeIds.length) {
                            for(var procTimeId of this.procTimeIds){
                                for (var i = 0; i < this.processingTimes.length; i++) {
                                    if (this.processingTimes[i]._id == procTimeId) {
                                        this.processingTimes.splice(i, 1);
                                        this.sessionService.setProcessingTimes(this.processingTimes);
                                    }
                                }
                            }
                        }
                        })
        }
        this.addProcessingTime();

    }
    addProcessingTime() {
        var bearbeitungsZeiten = [];

        for (var i = 0; i < this.checkedAP.length - 1; i++) {
            if (this.checkedAP[i]) {
                var bearbeitungsZeit = {
                    arbeitsplatz: this.workstations.find(ws => ws.nummer == i)._id,
                    teil: this.lastId,
                    ruestZeit: this.ruestZeit[i] ? this.ruestZeit[i] : 0,
                    fertigungsZeit: this.fertigungsZeit[i] ? this.fertigungsZeit[i] : 0,
                    nextArbeitsplatz: this.workstations.find(ws => ws.nummer == this.nextArbeitsplaetze[i]) ?
                        this.workstations.find(ws => ws.nummer == this.nextArbeitsplaetze[i])._id
                        : null
                }
                bearbeitungsZeiten.push(bearbeitungsZeit);
            }
        }
        if(bearbeitungsZeiten.length > 0) {
            this.partservice.addProcessingTimes(bearbeitungsZeiten)
                .subscribe(ba => {
                        for(var _ba of ba){
                            for(var pt of this.parts){
                                if(pt._id == _ba.teil){
                                    _ba.teil = pt;
                                }
                            }
                            for(var ws of this.workstations){
                                if(ws._id == _ba.arbeitsplatz){
                                    _ba.arbeitsplatz = ws;
                                }
                                if(ws._id == _ba.nextArbeitsplatz){
                                    _ba.nextArbeitsplatz = ws;
                                }
                            }
                            this.processingTimes.push(_ba);
                        }
                        this.sessionService.setProcessingTimes(this.processingTimes);
                        this.resetAll();
                    }
                    ,
                    err => console.error(err));
        }
        else{
            this.resetAll();
        }

    }
    deletePart(part){
        this.partservice.deletePart(part._id)
            .subscribe((data => {
                if (data.n == 1) {
                    for (var i = 0; i < this.parts.length; i++) {
                        if (this.parts[i]._id == part._id) {
                            this.parts.splice(i, 1);
                            this.sessionService.setParts(this.parts);
                        }
                    }
                }
            }))
    }

    setPart(pt) {
        this.resetAll();

        var verwendung = [];
        for (var p of pt.verwendung) {
            verwendung.push(p == "K" ? 1 : p == "D" ? 2 : 3);
        }

        this.part._id = pt._id;
        this.part.nummer = pt.nummer;
        this.part.bezeichnung = pt.bezeichnung;
        this.part.verwendung = verwendung;
        this.part.typ = pt.typ == "P" ? [1] : pt.typ == "E" ? [2] : [3];
        this.part.wert = pt.wert;
        this.part.lagerMenge = pt.lagerMenge;

        for (var chkAp of pt.bestandteile) {
            for (var part of this.parts) {
                if (part._id == chkAp._id) {
                    this.checkedParts[part.nummer] = true;
                    this.anzahl[part.nummer] = chkAp.anzahl;
                }
            }
        }

        for (var procTime of this.processingTimes) {
            if (pt._id == procTime.teil._id) {
                this.checkedAP[procTime.arbeitsplatz.nummer] = true;
                this.ruestZeit[procTime.arbeitsplatz.nummer] = procTime.ruestZeit;
                this.fertigungsZeit[procTime.arbeitsplatz.nummer] = procTime.fertigungsZeit;
                this.nextArbeitsplaetze[procTime.arbeitsplatz.nummer] = procTime.nextArbeitsplatz ? [procTime.nextArbeitsplatz.nummer] : null;
                this.procTimeIds.push(procTime._id);
            }
        }
        window.scrollTo(0, 0);
    }

    resetAll() {
        this.part = {
            _id: null,
            nummer: null,
            bezeichnung: null,
            verwendung: null,
            typ: null,
            wert: null,
            lagerMenge: null,
            bestandteile: null,
            lieferfrist: null,
            abweichung: null,
            diskontmenge: null,
            summe: null
        };

        while(this.ruestZeit.length > 0){
            this.ruestZeit.pop();
        }
        while(this.fertigungsZeit.length > 0){
            this.fertigungsZeit.pop();
        }
        while(this.checkedAP.length > 0){
            this.checkedAP.pop();
        }
        while(this.nextArbeitsplaetze.length > 0){
            this.nextArbeitsplaetze.pop();
        }
        while(this.anzahl.length > 0){
            this.anzahl.pop();
        }
        while(this.checkedParts.length > 0){
            this.checkedParts.pop();
        }
        while(this.procTimeIds.length > 0){
            this.procTimeIds.pop();
        }
        this.lastId = null;

        this.initCheckboxes();
    }

    isEmpty(part){
        if(part.typ == "P" || part.typ == "E") {
            return part.nummer == null && part.bezeichnung == null && part.lagerMenge == null
                && part.wert == null && part.verwendung.length <= 0;
        }
        else{
            return part.nummer == null && part.bezeichnung == null && part.lagerMenge == null
                && part.wert == null && part.verwendung.length <= 0 && part.lieferfrist == null
                && part.abweichung == null && part.diskontmenge == null;
        }
    }
}