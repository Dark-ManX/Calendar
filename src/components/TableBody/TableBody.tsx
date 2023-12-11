import axios from "axios";
import moment from "moment";
import { DragEvent, SyntheticEvent, useEffect, useState } from "react";
import shortid from "shortid";
import { ICalendar, IEl, addFuncs } from "../../additional";
import {
  CommonHoliday,
  DateDiv,
  Div,
  StyledRow,
  StyledTd,
  Text,
} from "./TableBody.styled";

const { pushElem, findElem, createMonthCondition, getCurrentMonth } = addFuncs;

interface IProps {
  date: string;
  rerendering: boolean;
  handleTableClick: (e: SyntheticEvent) => void;
  clickedDate: string | undefined;
}

const REQUEST_ADDRESS = "https://date.nager.at";
const COUNTRY = "UA";
const SERVER_ADDRESS = "https://calendar-server-dark-manx.vercel.app";

const TableBody = ({
  date,
  rerendering,
  handleTableClick,
  clickedDate,
}: IProps) => {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [deleteElem, setDeleteElem] = useState<string | undefined>("");
  const [checkedEvent, setCheckedEvent] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);

  let movedIdx: number = -1;

  addFuncs.createDates(date);

  const calendarDates: ICalendar = addFuncs.fillCalendar();

  function handleEventClick(e: SyntheticEvent): void {
    const { textContent } = e.target as HTMLElement;
    setCheckedEvent(!checkedEvent);
    setDeleteElem(textContent ? textContent : "");
  }

  async function handleDelete(e: SyntheticEvent) {
    const { parentNode, previousSibling } = e.target as HTMLButtonElement;
    const {
      dataset: { date },
    } = parentNode?.parentNode?.parentNode as HTMLElement;

    await axios.delete(
      `${SERVER_ADDRESS}/events/${date
        ?.split(" ")
        .join("_")}-${previousSibling?.textContent?.split(" ").join("_")}`
    );

    setReload(!reload);
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>, name: string) {
    movedIdx = myEvents.indexOf(findElem(myEvents, name));
  }

  function handleDragEnd(e: DragEvent<HTMLDivElement>) {}

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDragDrop(e: DragEvent<HTMLDivElement>, name: string) {
    const { textContent } = e.target as HTMLElement;

    const el = textContent ? findElem(myEvents, textContent) : null;
    const idx = myEvents.indexOf(el);

    setMyEvents((prev: any[]) => {
      return prev.map((el) => {
        if (el.length) {
          return el.map((elem: IEl) => {
            elem.order = movedIdx + 1;
            return elem;
          });
        } else if (el.event_title === myEvents[movedIdx].event_title) {
          myEvents[idx].order = movedIdx;
          el.order = idx;
          return el;
        }
        return el;
      });
    });

    e.stopPropagation();
    e.preventDefault();
  }

  function renderLayout(name: string, event: string = "") {
    return (
      <Div
        key={shortid.generate()}
        draggable
        onDrag={(e) => handleDragStart(e, name)}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDragDrop(e, name)}
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
      const fetchedEvents = await axios.get(`${SERVER_ADDRESS}/events/`);

      const {
        data: { payload },
      } = fetchedEvents;

      let order: number = 0;

      return payload?.reduce((acc: any, el: IEl, idx: number) => {
        order += 1;

        if (!acc.length) {
          pushElem(acc, { ...el, order });
          return acc;
        }

        const accCondition = acc.find((item: any, idx: number) => {
          if (item.length) {
            return item[0].event_date === el.event_date;
          }
          return item.event_date === el.event_date;
        });

        if (accCondition) {
          [acc[acc.indexOf(accCondition)]].push({ ...el, order });
          const index = acc.indexOf(accCondition);
          acc[index].length
            ? (acc = [...acc[index], { ...el, order }])
            : acc.push({ ...el, order });
          return acc;
        } else {
          acc.push({ ...el, order });
          return acc;
        }
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
                      createMonthCondition(el) < getCurrentMonth("start") ||
                      createMonthCondition(el) > getCurrentMonth("end")
                        ? "lightgray"
                        : "",
                  }}
                >
                  <DateDiv
                    style={{
                      backgroundColor:
                        el === moment(Date.now()).format("YYYY MM DD")
                          ? `"tomato"`
                          : "",
                    }}
                  >
                    <>
                      {Number(el.split(" ").at(-1)) ===
                      addFuncs._firstDayInMonth ? (
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
                  <div>
                    {myEvents
                      .sort((a, b) => {
                        return a.order - b.order;
                      })
                      .map((obj: any) => {
                        if (
                          moment(
                            obj[0] ? obj[0].event_date : obj.event_date
                          ).format("YYYY MM DD") !== el
                        )
                          return;

                        if (obj.length > 1) {
                          return (
                            <>
                              {obj.map(({ event_title }: IEl) => {
                                return renderLayout(event_title, deleteElem);
                              })}
                            </>
                          );
                        }
                        const { event_title } = obj;
                        return renderLayout(event_title, deleteElem);
                      })}
                  </div>
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
