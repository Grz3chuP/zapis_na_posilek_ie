export interface IDane {
  menuNastepnyMiesiac: IDaneMiesiaca[];
  menuObecnyMiesiac: IDaneMiesiaca[];
  miesiacNastepny: null;
  miesiacObecny: null;
}

export interface IDaneMiesiaca {
  created_at: string; //    "2024-10-21 12:54:57"
  data: string;//    "2024-11-01"
  dzien: number;//    1
  id: number;//    1033
  kategoria: number;//    1
  miesiac: number; //    11
  opis: string; //    "Zupa pomidorowa, kotlet mielony, ziemniaki, surówka."
  rok: number; //  2024
  updated_at: string; //    "2024-10-21 12:54:57"
  zapisPracownika: IZapisPracownika | null;
  zapisal_id: number; //    1
}

export interface IZapisPracownika {
  created_at: string;
  czy_potwierdzony_dzien: number | null;
  data_potwierdzenia_dnia: string;
  data_wycofania: string | null;
  dni_menu_id: number;
  id: number | null;
  osoba_edytujaca: number;
  rodzaj_wycofania: string | null;
  stolowka_miesiace_id: number;
  updated_at: string;
  uwaga_wycofania: string | null;
  zmiana: number | null;
}
