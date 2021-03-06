import {Component} from '@angular/core';
import {ForecastService} from '../../services/forecast.service'
import {SessionService} from '../../services/session.service'
import {Part} from '../../model/part';
import {Forecast} from '../../model/forecast';
import {TranslateService} from "../../translate/translate.service";


@Component({
    moduleId: module.id,
    selector: 'forecast',
    templateUrl: 'forecast.component.html'
})
export class ForecastComponent {
    pParts: Array<Part>;
    result: any;
    periods: Array<number> = new Array<number>();
    period: number = 0;
    lager: any;
    verbdindlAuftr: Array<number> = new Array<number>();
    geplProd: Array<number> = new Array<number>();
    vorausBestand: Array<number> = new Array<number>();
    forecasts: Array<Forecast> = new Array<Forecast>();

    menge: Array<number> = new Array<number>();
    preis: Array<number> = new Array<number>();
    strafe: Array<number> = new Array<number>();

    constructor(private forecastService: ForecastService, private sessionService: SessionService, private translateService: TranslateService) {
        if (this.sessionService.getResultObject()) {
            this.result = this.sessionService.getResultObject();
            this.period = Number.parseInt(this.result.results.period)+1;
            this.lager = this.result.results.warehousestock.article;

            for (let i = this.period; i <= this.period + 3; i++) {
                this.periods.push(i);
            }
        }
        this.forecastService.getForecastAndParts()
            .subscribe(data => {
                    this.forecasts = data[0];
                    this.pParts = data[1].filter(item => item.typ == "P")
                },
                err => console.error(err),
                () => this.initAll());

    }

    initAll() {
        if (this.sessionService.getForecast()) {
            while (this.forecasts && this.forecasts.length > 0) {
                this.forecasts.pop();
            }
            this.forecasts.push(this.sessionService.getForecast());
        }
        if (this.forecasts) {
            for (let fc of this.forecasts) {
                if (fc.period === this.period) {
                    for (let article of fc.article) {
                        for (let vA of article.verbdindlicheAuftraege) {
                            this.verbdindlAuftr["P_" + article.partNr + "_" + vA.periode] = vA.anzahl;
                        }
                        for (let gP of article.geplanteProduktion) {
                            this.geplProd["P_" + article.partNr + "_" + gP.periode] = gP.anzahl;
                        }
                        for (let vB of article.voraussichtlicherBestand) {
                            this.vorausBestand["P_" + article.partNr + "_" + vB.periode] = vB.anzahl;
                        }
                        this.menge["P_" + article.partNr] = article.direktVerkauf.menge;
                        this.preis["P_" + article.partNr] = article.direktVerkauf.preis;
                        this.strafe["P_" + article.partNr] = article.direktVerkauf.strafe;
                    }
                }
            }
        }
        this.saveForecast();
    }

    updateArrays(part, period, clearMatAndDispo) {
        if(clearMatAndDispo){
            this.sessionService.setMatPlan(null);
            this.sessionService.setPartOrders(null);
        }
        if (period !== this.period + 3) {
            for (let i = period; i <= this.period + 3; i++) {
                this.vorausBestand["P_" + part + "_" + i] = this.getLagermenge(part, i) + this.getGeplProd(part, i) - this.getVerbindlAuftr(part, i);
            }
        }
        else {
            this.vorausBestand["P_" + part + "_" + period] = this.getLagermenge(part, period) + this.getGeplProd(part, period) - this.getVerbindlAuftr(part, period);
        }

        this.saveForecast();

    }

    getLagermenge(part, period) {
        let lagermenge = 0;
        if (period !== this.period) {
            lagermenge = this.vorausBestand["P_" + part + "_" + (period - 1)];
        }
        else {
            for (let article of this.lager) {
                if (Number.parseInt(article.id) === part) {
                    lagermenge = Number.parseInt(article.amount);
                }
            }
        }
        return lagermenge;
    }

    getGeplProd(part, period) {
        return this.geplProd["P_" + part + "_" + period] ? this.geplProd["P_" + part + "_" + period] : 0;
    }

    getVerbindlAuftr(part, period) {
        return this.verbdindlAuftr["P_" + part + "_" + period] ? this.verbdindlAuftr["P_" + part + "_" + period] : 0;
    }

    saveForecast() {
            let forecast: Forecast = new Forecast();
            forecast.article = new Array<any>();
            let direktVerkauf: any;

            for (let pPart of this.pParts) {
                let verbdindlAuftr: Array<any> = new Array<any>();
                let geplProd: Array<any> = new Array<any>();
                let vorausBestand: Array<any> = new Array<any>();

                for (let i = this.period; i <= this.period + 3; i++) {
                    if (this.verbdindlAuftr["P_" + pPart.nummer + "_" + i]) {
                        verbdindlAuftr.push({
                            periode: i,
                            anzahl: this.verbdindlAuftr["P_" + pPart.nummer + "_" + i] ? this.verbdindlAuftr["P_" + pPart.nummer + "_" + i] : 0
                        });
                    }
                }
                for (let i = this.period; i <= this.period + 3; i++) {
                    if (this.geplProd["P_" + pPart.nummer + "_" + i]) {
                        geplProd.push({
                            periode: i,
                            anzahl: this.geplProd["P_" + pPart.nummer + "_" + i] ? this.geplProd["P_" + pPart.nummer + "_" + i] : 0
                        });
                    }
                }
                for (let i = this.period; i <= this.period + 3; i++) {
                    if (this.vorausBestand["P_" + pPart.nummer + "_" + i]) {
                        vorausBestand.push({
                            periode: i,
                            anzahl: this.vorausBestand["P_" + pPart.nummer + "_" + i] ? this.vorausBestand["P_" + pPart.nummer + "_" + i] : 0
                        });
                    }
                }
                direktVerkauf = {
                    menge: this.menge["P_" + pPart.nummer] ? this.menge["P_" + pPart.nummer] : 0,
                    preis: this.preis["P_" + pPart.nummer] ? this.preis["P_" + pPart.nummer] : 0,
                    strafe: this.strafe["P_" + pPart.nummer] ? this.strafe["P_" + pPart.nummer] : 0
                };
                forecast.period = this.period;
                forecast.article.push({
                    partNr: pPart.nummer,
                    verbdindlicheAuftraege: verbdindlAuftr,
                    geplanteProduktion: geplProd,
                    voraussichtlicherBestand: vorausBestand,
                    direktVerkauf: direktVerkauf,
                    produktkennung: pPart.bezeichnung.charAt(0)
                });
            }
        this.sessionService.setForecast(forecast);
    }
}

