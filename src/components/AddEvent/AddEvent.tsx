import { FC, SyntheticEvent, useState } from "react";
import moment from "moment";
import axios from "axios";
import { StyledDiv, CloseBtn, EventTitle } from "./AddEvent.styled";

interface IEventProps {
  date: string | undefined;
  onRerender: () => void;
  handleModalVisibility: () => void;
}

const REQUEST_ADDRESS = "http://localhost:2222";

const AddEvent: FC<IEventProps> = ({
  date,
  onRerender,
  handleModalVisibility,
}) => {
  const [event, setEvent] = useState<string | undefined>("");

  function handleChange(e: SyntheticEvent) {
    const { value } = e.target as HTMLTextAreaElement;
    setEvent(value);
  }
  async function handleCreateEvent(e: SyntheticEvent): Promise<void> {
    e.preventDefault();

    if (!event) return;

    await axios.post(`${REQUEST_ADDRESS}/events`, {
      date: moment(date).format("YYYY MM DD"),
      title: event,
    });

    onRerender();
    reset();
  }

  function reset(): void {
    setEvent("");
  }

  return (
    <StyledDiv>
      <CloseBtn type="button" onClick={handleModalVisibility}></CloseBtn>
      <EventTitle>Add your's event</EventTitle>
      <form onClick={handleCreateEvent}>
        <textarea
          name="event"
          cols={30}
          rows={10}
          value={event}
          onChange={handleChange}
        ></textarea>
        <button type="submit" onClick={handleModalVisibility}>
          Add event
        </button>
      </form>
    </StyledDiv>
  );
};

export default AddEvent;
