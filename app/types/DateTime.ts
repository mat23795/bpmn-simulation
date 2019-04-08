export class DateTime{
    private _date: string;
     constructor(year: number, month: number, day: number,
                 hour: number = 0, minutes: number = 0, seconds: number = 0){
         var temp = new Date(Date.UTC(year,month,day,hour,minutes,seconds));
         this._date = temp.toISOString();
     }

     get date() : string{
         return this._date;
     }
}