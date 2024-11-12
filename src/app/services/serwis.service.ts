import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as crypto from 'crypto-js';

declare let toastr: any;
@Injectable({
  providedIn: 'root'
})
export class SerwisService {

  private _token: string = "";
  constructor(private http: HttpClient) { }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }
  zapytaj_o(co: string , dla: any): Observable<any> {
    return this.http.post(`/apps/xhr/zapis_na_posilek/zapytaj_o/${co}`, {
      dla: dla
    })
  }

  zapytaj_full_response(id: string, user: any) {
    return this.http.post(`/apps/xhr/zapis_na_posilek/zapytaj_o/${id}`, { dla: user }, { observe: 'response' });
  }
  zapisz(co: string , dla: any): Observable<any> {
    return this.http.post(`/apps/xhr/zapis_na_posilek/zapisz/${co}`, {
      payload: dla
    })
  }

  zapisz_securly(co: string , dla: any): Observable<any> {
    const headers = new HttpHeaders({ Authorization: this.token });

    return this.http.post(`/apps/xhr/zapis_na_posilek/zapisz/${co}`, {
      payload: dla
    },
      {headers: headers})
  }

  clearToken() {
    this.token = "";
  }
  private generateToken(id: string, nr: string): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const dataToHash = id + nr + date;

    // Generowanie hasha w SHA-256 (które będzie odpowiadać Hash::make() po stronie backendu)
    const hashedToken = crypto.SHA256(dataToHash).toString(crypto.enc.Hex);

    return hashedToken;
  }

  upload(formData: any, options: any): Observable<any> {
    return this.http.post(`/apps/xhr/przyrzady/upload`, formData, options);
  }

  errorhandler(d: any) {
    let byl_juz_komunikat = false;
    if (d.error.errors) {
      console.error(d);
      if (typeof d.error.errors === 'string') {
        //this.message.add({summary: d.error.errors, severity: 'error', icon: 'pi pi-times'});
        toastr.error(d.error.errors);
        if (d.error.message) {
          toastr.error(d.error.message);
          //this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
          if (d.error.message.toLowerCase().includes('unauthenticated')) {
            document.location.replace('../../logout?akcja=logout&target=' + location.pathname.substring(1));
          }
        }
        return;
      }
      for (let key in d.error.errors) {
        if (d.error.errors.hasOwnProperty(key)) {
          d.error.errors[key].forEach((wiadomosc: string) => {
            toastr.error(wiadomosc);
            // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
            byl_juz_komunikat = true;
          });
        }
      }
      if (!byl_juz_komunikat) {
        toastr.error(d.error.message);
        // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
      }
    }
    if (!byl_juz_komunikat) {
      toastr.error('Bład ' + d.message);
      // this.message.add({summary: d.error.message, severity: 'error', icon: 'pi pi-times'});
    }
  }
}
