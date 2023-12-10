import { FC, DragEvent, useState, useEffect, SyntheticEvent } from "react";
import moment from "moment";
import shortid from "shortid";
import axios from "axios";
import {
  CommonHoliday,
  DateDiv,
  StyledRow,
  StyledTd,
  Text,
  Div,
} from "./TableBody.styled";

interface ICalendar {
  firstWeek: string[];
  secondWeek: string[];
  thirdWeek: string[];
  fourthWeek: string[];
  fifthWeek: string[];
  sixthWeek: string[];
}

interface IProps {
  date: string;
  rerendering: boolean;
  handleTableClick: (e: SyntheticEvent) => void;
  clickedDate: string | undefined;
}

interface IEl {
  id: number;
  event_date: string;
  event_title: string;
}

const REQUEST_ADDRESS = "https://date.nager.at";
const COUNTRY = "UA";
const SERVER_ADDRESS = "https://calendar-server-dark-manx.vercel.app/";

const TableBody: FC<IProps> = ({
  date,
  rerendering,
  handleTableClick,
  clickedDate,
}) => {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [deleteElem, setDeleteElem] = useState<string | undefined>("");
  const [checkedEvent, setCheckedEvent] = useState<boolean>(false);
  // const [startDrag, setStartDrag] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  const dates: string[] = [...Array(42)];
  const startDate: any = moment(date)
    .startOf("month")
    .startOf("week")
    .format("YYYY MM DD");

  const firstDayInMonth: number = 1;
  const daysInWeek: number = 7;

  createDates(dates);

  function createDates(arr: any[]): any {
    let num: number = 0;
    arr.map(() => {
      arr[num] = moment(startDate).add(num, "days").format("YYYY MM DD");
      num += 1;
    });
  }

  const calendarDates: ICalendar = fillCalendar(dates);

  function fillCalendar(data: string[]): ICalendar {
    return data.reduce(
      (acc: ICalendar, el: string): any => {
        switch (Math.floor(dates.indexOf(el) / daysInWeek)) {
          case 0:
            pushElem(acc.firstWeek, el);
            return acc;
          case 1:
            pushElem(acc.secondWeek, el);
            return acc;
          case 2:
            pushElem(acc.thirdWeek, el);
            return acc;
          case 3:
            pushElem(acc.fourthWeek, el);
            return acc;
          case 4:
            pushElem(acc.fifthWeek, el);
            return acc;
          case 5:
            pushElem(acc.sixthWeek, el);
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

  function pushElem(arr: any, elToPush: any) {
    return arr.push(elToPush);
  }

  function handleEventClick(e: SyntheticEvent): void {
    const { textContent } = e.target as HTMLElement;
    setCheckedEvent(!checkedEvent);
    setDeleteElem(textContent ? textContent : "");
  }

  async function handleDelete(e: SyntheticEvent) {
    const { parentNode, previousSibling } =
      e.currentTarget as HTMLButtonElement;
    const {
      dataset: { date },
    } = parentNode?.parentNode as HTMLElement;

    await axios.delete(
      `${SERVER_ADDRESS}/events/${date
        ?.split(" ")
        .join("_")}-${previousSibling?.textContent?.split(" ").join("_")}`
    );

    setReload(!reload);
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>): void {
    const { offsetLeft } = e.target as HTMLElement;
    console.log("dragStart", offsetLeft);
    // e.preventDefault();
    // setStartDrag(true);
  }

  function handleDragEnd(e: DragEvent<HTMLDivElement>) {
    const { offsetLeft } = e.target as HTMLElement;
    console.log("dragEnd", offsetLeft);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    const { offsetLeft } = e.target as HTMLElement;
    console.log("dragover", offsetLeft);
  }

  function handleDragDrop(e: DragEvent<HTMLDivElement>) {
    const { offsetLeft } = e.target as HTMLElement;
    console.log("dragDrop");
    console.dir(e.target);
  }

  function renderLayout(name: string, event: string = "") {
    return (
      <Div
        key={shortid.generate()}
        draggable
        onDragStart={handleDragStart}
        // onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        // onDragLeave={handleDragLeave}
        onDrop={handleDragDrop}
        onClick={handleEventClick}
      >
        <CommonHoliday>{name}</CommonHoliday>
        {checkedEvent && name === event && (
          <button onClick={handleDelete}>delete</button>
        )}
      </Div>
    );
  }

  useEffect(() => {
    getPublicHolidays().then((res) => setHolidays(res));

    async function getPublicHolidays(): Promise<any[]> {
      const fetchedHolidays = await axios.get(
        `${REQUEST_ADDRESS}/api/v3/PublicHolidays/${moment(date).format(
          "YYYY"
        )}/${COUNTRY}`
      );

      return fetchedHolidays.data;
    }

    getMyEvents().then((res) => setMyEvents(res));

    async function getMyEvents(): Promise<any> {
      const fetchedEvents = await axios.get(`${SERVER_ADDRESS}/events/getAll`);

      const {
        data: { payload },
      } = fetchedEvents;

      return payload?.reduce((acc: any[], el: IEl, idx: number) => {
        if (!acc.length) {
          pushElem(acc, [el]);
          return acc;
        }

        const condition = acc.find((item: IEl[], i: number) => {
          return item[0].event_date === el.event_date;
        });

        if (!condition) {
          pushElem(acc, [el]);
          return acc;
        }

        const index = acc.indexOf(condition);
        pushElem(acc[index], el);
        return acc;
      }, []);
    }
  }, [date, reload, rerendering]);

  return (
    <tbody onClick={(e) => handleTableClick(e)}>
      {Object.keys(calendarDates).map((elem: string) => {
        return (
          <StyledRow key={shortid.generate()}>
            {calendarDates[elem as keyof ICalendar].map((el: string) => {
              return (
                <StyledTd
                  key={shortid.generate()}
                  data-date={el}
                  style={{
                    backgroundColor:
                      Number(el!.split(" ")!.slice(1).join("")) <
                        Number(
                          moment(Date.now())
                            .startOf("month")
                            .format("MM DD")
                            .split(" ")
                            .join("")
                        ) ||
                      Number(el.split(" ").slice(1).join("")) >
                        Number(
                          moment(Date.now())
                            .endOf("month")
                            .format("MM DD")
                            .split(" ")
                            .join("")
                        )
                        ? "lightgray"
                        : "",
                  }}
                >
                  <DateDiv
                    style={{
                      backgroundColor:
                        el === moment(Date.now()).format("YYYY MM DD")
                          ? "tomato"
                          : "",
                    }}
                  >
                    <>
                      {Number(el.split(" ").at(-1)) === firstDayInMonth ? (
                        <Text>{moment(el).format("DD MMM")}</Text>
                      ) : (
                        <p>{el.split(" ").at(-1)}</p>
                      )}
                    </>
                  </DateDiv>
                  <>
                    {holidays.map(({ date, name }: any) => {
                      if (
                        moment(date).format("MM DD") !==
                        el.split(" ").slice(1).join(" ")
                      )
                        return;

                      return renderLayout(name, deleteElem);
                    })}
                  </>
                  <>
                    {myEvents.map((obj: any) => {
                      if (moment(obj[0].event_date).format("YYYY MM DD") !== el)
                        return;

                      if (obj.length > 1) {
                        return obj.map(({ event_title }: IEl) =>
                          renderLayout(event_title, deleteElem)
                        );
                      }
                      const { event_title } = obj;
                      return renderLayout(event_title, deleteElem);
                    })}
                  </>
                </StyledTd>
              );
            })}
          </StyledRow>
        );
      })}
    </tbody>
  );
};

export default TableBody;
