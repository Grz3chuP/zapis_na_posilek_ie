import {Component, inject} from '@angular/core';
import {IDaneLogowania} from '../interfaces/IDaneLogowania';
import {FormsModule} from '@angular/forms';
import {loading} from '../services/loading';
import {SerwisService} from '../services/serwis.service';
import {IDane, IZapisPracownika} from '../interfaces/IDane';
import {IDaneDaty} from '../interfaces/IDaneDaty';
import {IPracownik} from '../interfaces/IPracownik';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-miesiac',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './miesiac.component.html',
  styleUrl: './miesiac.component.css'
})
export class MiesiacComponent {
  serwis = inject(SerwisService);

  statusLogowania = 0;
  daneLogowania: IDaneLogowania | undefined;
  dane: IDane | undefined;
  daneDaty: IDaneDaty | undefined;
  pracownik: IPracownik | undefined;
  constructor() {
 this.daneLogowania = {
    id: '',
    nr: ''
  };

  }

dodawanieLiczbyDoDanychLogowania(liczba: number) {
  if(!this.statusLogowania) {
    this.daneLogowania!.id += liczba.toString();
  } else {
    this.daneLogowania!.nr += liczba.toString();
  }

}

  wprowadzID() {
   if(this.statusLogowania === 1) {
   this.wczytajDaneUzytkowniak();
   } else {
     this.statusLogowania += 1;
   }
  }

  wyczyscDaneLogowania() {
    if(this.statusLogowania === 0) {
      this.daneLogowania!.id = '';
    } else {
      this.daneLogowania!.nr = '';
    }
  }
  wyczysczCalkowiteDaneLogowania() {
    this.daneLogowania!.id = '';
    this.daneLogowania!.nr = '';
    this.statusLogowania = 0;
  }
  wczytajDaneUzytkowniak() {
    loading.set(true);
    this.serwis.zapytaj_full_response('numer_karty', this.daneLogowania)
      .subscribe({
        next:(d: any) => {

          this.serwis.token = d.headers.get("Authorization");
          this.dane = d.body.dane;
          this.daneDaty = d.body.dane_daty;
          this.pracownik = d.body.pracownik;
          this.statusLogowania = 2;
          loading.set(false);
        },
        error: (dane: any) => {

          this.wyczysczCalkowiteDaneLogowania();
          this.serwis.errorhandler(dane);
          loading.set(false);
        }
      })
  }
  getDayOfWeek(dateString: string): string {
    const daysOfWeek = ['Nie', 'Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob'];

    const date = new Date(dateString);
    const dayIndex = date.getDay();  // Zwraca liczbę od 0 (Niedziela) do 6 (Sobota)

    return daysOfWeek[dayIndex];
  }
  getMonthName(numerDaty: string): string {
    const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
    return months[parseInt(numerDaty) - 1];

  }

  wyloguj() {
    this.statusLogowania = 0;
    this.dane = undefined;
    this.daneDaty = undefined;
    this.pracownik = undefined;
    this.wyczysczCalkowiteDaneLogowania();
  }
  scroll(offset: number) {
    window.scrollBy({
      top: offset, // Ustawienie wartości offsetu w pikselach
      behavior: 'smooth' // Płynne przewijanie
    });
  }

  reverseDateFormat(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  }
  isDateExpired(dateString: string): boolean {
    const today = new Date(); // Dzisiejsza data
    const dateToCompare = new Date(dateString); // Konwersja stringa na obiekt Date
    dateToCompare.setDate(dateToCompare.getDate() - 1);
    // Porównanie dat - data musi być starsza lub równa dzisiejszej, by przycisk był aktywny
    return dateToCompare < today;
  }

  wybierzZmianeAbyZatwierdzicPosilek(zapisPracownika: IZapisPracownika | null, dzien: number, zmiana: number, index: number, nextMonth: boolean) {

    if(!zapisPracownika) {
    loading.set(true);
    let pustyZapisPracownika = {
      czy_potwierdzony_dzien: 1,
      id: null,
      rodzaj_wycofania: null,
      zmiana: zmiana
    }
    this.serwis.zapisz_securly('zmiana', {dzien_id: dzien, id: this.pracownik!.id, nr: this.pracownik!.nr_karty, zapisPracownika: pustyZapisPracownika})
      .subscribe({
        next: (dane: any) => {
          loading.set(false);
          if(!nextMonth) {
            this.dane!.menuObecnyMiesiac[index].zapisPracownika = dane.dzien;
          } else {
            this.dane!.menuNastepnyMiesiac[index].zapisPracownika = dane.dzien;
          }
        },
        error: (dane: any) => {
          loading.set(false);
          this.serwis.errorhandler(dane);
        }
      });

    } else if(zapisPracownika) {
      zapisPracownika.zmiana = zmiana;
     loading.set(true);
      this.serwis.zapisz_securly('zmiana', {dzien_id: dzien, id: this.pracownik!.id, nr: this.pracownik!.nr_karty, zapisPracownika: zapisPracownika})
        .subscribe({
          next: (dane: any) => {
            loading.set(false);
            if(!nextMonth) {
              this.dane!.menuObecnyMiesiac[index].zapisPracownika = dane.dzien;
            } else {
              this.dane!.menuNastepnyMiesiac[index].zapisPracownika = dane.dzien;
            }
          },
          error: (dane: any) => {
            loading.set(false);
            this.serwis.errorhandler(dane);
          }
        });

    }

  }

  nieKorzystamZPosilku(zapisPracownika: IZapisPracownika | null, dzien: number, index: number, nextMonth: boolean) {
    loading.set(true);
    if(!zapisPracownika) {
      let pustyZapisPracownika = {
        czy_potwierdzony_dzien: 1,
        id: null,
        rodzaj_wycofania: "I",
        zmiana: null
      }
      this.serwis.zapisz_securly('nieobecnosc', {dzien_id: dzien, id: this.pracownik!.id, nr: this.pracownik!.nr_karty, zapisPracownika: pustyZapisPracownika})
        .subscribe({
          next: (dane: any) => {
            loading.set(false);
            if(!nextMonth) {
              this.dane!.menuObecnyMiesiac[index].zapisPracownika = dane.dzien;
            } else {
              this.dane!.menuNastepnyMiesiac[index].zapisPracownika = dane.dzien;
            }
          },
          error: (dane: any) => {
            loading.set(false);
            this.serwis.errorhandler(dane);
          }
        });
    } else if(zapisPracownika) {
      zapisPracownika.rodzaj_wycofania = "I";
      this.serwis.zapisz_securly('nieobecnosc', {dzien_id: dzien, id: this.pracownik!.id, nr: this.pracownik!.nr_karty, zapisPracownika: zapisPracownika})
        .subscribe({
          next: (dane: any) => {
            loading.set(false);
            zapisPracownika = dane.dzien;
            if(!nextMonth) {
              this.dane!.menuObecnyMiesiac[index].zapisPracownika = dane.dzien;
            } else {
              this.dane!.menuNastepnyMiesiac[index].zapisPracownika = dane.dzien;
            }
          },
          error: (dane: any) => {
            loading.set(false);
            this.serwis.errorhandler(dane);
          }
        });
    }
  }
  potwierdzenieZapisuNaZmiane() {

  }
}
