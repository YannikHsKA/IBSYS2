/**
 * Created by Paddy on 13.11.2016.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PartService{
    constructor(private http:Http){
        console.log('Part Service Initialized...');
    }

    getParts(){
        return this.http.get('api/parts')
            .map(res => res.json());
    }
    /*
    addWorkstation(newWorkstation){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/workstation', JSON.stringify(newWorkstation), {headers:headers})
            .map(res => res.json());
    }

    deleteWorkstation(id){
        return this.http.delete('/api/workstation/' + id)
            .map(res => res.json());
    }
    updateWorkstation(workstation){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/workstation/' + workstation._id, JSON.stringify(workstation), {headers:headers})
            .map(res => res.json());
    }*/
}