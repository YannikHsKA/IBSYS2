import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import 'rxjs/add/operator/map';

@Injectable()
export class MaterialPlanningService {

    constructor(private http: Http) {
        console.log('MaterialPlanning Service Initialzed...');
    }

    getKParts() {
        return this.http.get('/api/kparts')
            .map(res => res.json());
    }

}