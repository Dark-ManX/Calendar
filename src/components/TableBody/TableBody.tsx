import { FC, DragEvent, useState, useEffect, SyntheticEvent } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import moment from "moment";
import shortid from "shortid";
import axios from "axios";
import { addFuncs } from "../../additional";
import { ICalendar, IEl } from "../../additional";
import {
  CommonHoliday,
  DateDiv,
  StyledRow,
  StyledTd,
  Text,
  Div,
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
  // const [movedEvent, setMovedEvent] = useState<any>(null);
  const [reload, setReload] = useState<boolean>(false);

  let movedIdx: number = -1;

  addFuncs.createDates(date);

  const calendarDates: ICalendar = addFuncs.fillCalendar();

  function handleEventClick(e: SyntheticEvent): void {
    const { textContent } = e.target as HTMLElement;
    setCheckedEvent(!checkedEvent);
    setDeleteElem(textContent ? textContent : "");

    console.log("delElem", deleteElem, textContent);
  }

  async function handleDelete(e: SyntheticEvent) {
    const { parentNode, previousSibling } =
      e.currentTarget as HTMLButtonElement;
    const {
      dataset: { date },
    } = parentNode?.parentNode as HTMLElement;
    console.log(
      `${SERVER_ADDRESS}/events/${date
        ?.split(" ")
        .join("_")}-${previousSibling?.textContent?.split(" ").join("_")}`
    );
    await axios.delete(
      `${SERVER_ADDRESS}/events/${date
        ?.split(" ")
        .join("_")}-${previousSibling?.textContent?.split(" ").join("_")}`
    );

    setReload(!reload);
  }

  function handleDragStart(e: DragEvent<HTMLDivElement>, name: string) {
    console.log(myEvents.indexOf(findElem(myEvents, name)));
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

    setMyEvents((prev: IEl[]) => {
      return prev.map((el) => {
        if (el.event_title === textContent) {
          el.order = movedIdx + 1;
          return el;
        } else if (el.event_title === myEvents[movedIdx].event_title) {
          el.order = idx + 1;
          return el;
        }
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
    getPublicHolidays().then((res) => {
      console.log(res);
      setHolidays(res);
    });

    async function getPublicHolidays(): Promise<any[]> {
      const fetchedHolidays = await axios.get(
        `${REQUEST_ADDRESS}/api/v3/PublicHolidays/${moment(date).format(
          "YYYY"
        )}/${COUNTRY}`
      );

      return fetchedHolidays.data;
    }

    getMyEvents().then((res) => {
      setMyEvents(res);
    });

    async function getMyEvents(): Promise<any> {
      const fetchedEvents = await axios.get(`${SERVER_ADDRESS}/events/`);

      const {
        data: { payload },
      } = fetchedEvents;
      console.log("object", payload);

      let order: number = 0;

      return payload?.reduce((acc: any, el: IEl) => {
        order += 1;

        if (!acc.length) {
          addFuncs.pushElem(acc, { ...el, order });
          console.log(acc);
          return acc;
        }

        const condition = acc.find((item: IEl) => {
          return item.event_date === el.event_date;
        });

        if (!condition) {
          pushElem(acc, { ...el, order });
          return acc;
        }

        const index = acc.indexOf(condition);
        acc = [acc[index], { ...el, order }];
        console.log(acc);
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
                      .sort((a, b) => a.order - b.order)
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
