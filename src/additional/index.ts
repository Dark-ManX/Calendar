import moment from "moment";

export interface ICalendar {
  firstWeek: string[];
  secondWeek: string[];
  thirdWeek: string[];
  fourthWeek: string[];
  fifthWeek: string[];
  sixthWeek: string[];
}

export interface IEl {
  id: number;
  event_date: string;
  event_title: string;
  order?: number;
}

moment.updateLocale("en", { week: { dow: 1 } });

class AdditionalFunc {
  readonly _daysInWeek: number;
  public _startDate: string;
  public _firstDayInMonth: number;
  public dates: any[];

  public constructor() {
    this._daysInWeek = 7;
    this._startDate = moment(Date.now())
      .startOf("month")
      .startOf("week")
      .format("YYYY MM DD");
    this.dates = [...Array(42)];
    this._firstDayInMonth = 1;
  }

  public createDates(date: string): any {
    let num: number = 0;
    this.dates.map(() => {
      this.dates[num] = moment(this._startDate)
        .add(num, "days")
        .format("YYYY MM DD");
      num += 1;
    });
  }

  public fillCalendar() {
    return this.dates.reduce(
      (acc: ICalendar, el: string): any => {
        switch (Math.floor(this.dates.indexOf(el) / this._daysInWeek)) {
          case 0:
            this.pushElem(acc.firstWeek, el);
            return acc;
          case 1:
            this.pushElem(acc.secondWeek, el);
            return acc;
          case 2:
            this.pushElem(acc.thirdWeek, el);
            return acc;
          case 3:
            this.pushElem(acc.fourthWeek, el);
            return acc;
          case 4:
            this.pushElem(acc.fifthWeek, el);
            return acc;
          case 5:
            this.pushElem(acc.sixthWeek, el);
            return acc;
          default:
            return acc;
        }
      },
      {
        firstWeek: [],
        secondWeek: [],
        thirdWeek: [],
        fourthWeek: [],
        fifthWeek: [],
        sixthWeek: [],
      }
    );
  }

  public pushElem(arr: any, elToPush: any): any[] {
    return arr.push(elToPush);
  }

  public findElem(arr: IEl[], condition: string): IEl | undefined {
    return arr.find((el) => el.event_title === condition);
  }

  public createMonthCondition(arg: string) {
    return Number(arg.split(" ").slice(1).join(""));
  }

  public getCurrentMonth(arg: string): number {
    switch (arg) {
      case "start":
        return Number(
          moment(Date.now())
            .startOf("month")
            .format("MM DD")
            .split(" ")
            .join("")
        );
      case "end":
        return Number(
          moment(Date.now()).endOf("month").format("MM DD").split(" ").join("")
        );
      default:
        return 0;
    }
  }
}

export const addFuncs = new AdditionalFunc();
