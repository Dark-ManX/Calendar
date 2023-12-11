import moment from "moment";
import { FC, SyntheticEvent, useState } from "react";
import AddEvent from "../AddEvent/AddEvent";
import Modal from "../Modal";
import TableBody from "../TableBody";
import TableHead from "../TableHead";
import {
  Header,
  MonthTitle,
  NextButton,
  PrevButton,
  StyledDiv,
  StyledTable,
} from "./App.styled";

const App: FC = () => {
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  const [curDate, setCurDate] = useState<string>(
    moment(Date.now()).format("YYYY MM DD")
  );
  const [modalShown, setModalShown] = useState<boolean>(false);
  const [eventDate, setEventDate] = useState<string | undefined>("");
  const [rerender, setRerender] = useState<boolean>(false);

  function handleMonthChange(e: SyntheticEvent) {
    const {
      dataset: { action },
    } = e.target as HTMLButtonElement;
    switch (action) {
      case "decrement":
        setCurDate(moment(curDate).subtract(1, "months").format("YYYY MM DD"));
        break;
      case "increment":
        setCurDate(moment(curDate).add(1, "months").format("YYYY MM DD"));
        break;
      default:
        break;
    }
  }

  function onTableClick(e: SyntheticEvent) {
    const {
      nodeName,
      dataset: { date },
    } = e.target as HTMLElement;
    if (nodeName !== "TD") return;
    console.dir(e.currentTarget);
    setModalShown(!modalShown);
    setEventDate(date);
  }

  function onModalShown() {
    setModalShown(!modalShown);
  }

  function onModalStateChange(e: SyntheticEvent) {
    const { id } = e.target as HTMLElement;
    if (id !== "backdrop") return;
    setModalShown(!modalShown);
  }

  function handleRerender() {
    setRerender(!rerender);
  }

  return (
    <div className="App">
      <Header>Calendar</Header>
      <StyledDiv>
        <NextButton
          data-action="increment"
          onClick={handleMonthChange}
        ></NextButton>
        <MonthTitle>{moment(curDate).format("MMMM")}</MonthTitle>
        <PrevButton
          data-action="decrement"
          onClick={handleMonthChange}
        ></PrevButton>
      </StyledDiv>
      <StyledTable>
        <TableHead />
        <TableBody
          date={curDate}
          rerendering={rerender}
          handleTableClick={onTableClick}
          clickedDate={eventDate}
        />
      </StyledTable>
      {modalShown && (
        <Modal handleBackdropClick={onModalStateChange}>
          <AddEvent
            date={eventDate}
            onRerender={handleRerender}
            handleModalVisibility={onModalShown}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;
