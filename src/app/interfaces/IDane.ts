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
  zapisal_id: number; //    1
}
