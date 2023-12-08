import styled from "styled-components";

export const Header = styled.h1`
  font-size: 30px;
  font-weight: 700;
`;

export const StyledTable = styled.table`
  width: 100%;
`;

export const TableHead = styled.thead`
  background-color: lemonchiffon;
`;

export const StyledHeadData = styled.th`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
`;

export const StyledRow = styled.tr`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  height: 100px;
  margin-bottom: 5px;
`;

export const StyledTd = styled.td`
  border: 1px solid gray;
  display: flex;
  justify-content: start;
  align-items: start;
  padding: 5px;
`;

export const DateDiv = styled.div`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
`;

export const Text = styled.p`
  font-weight: bold;
`;

export const MonthTitle = styled.p`
  font-size: 24px;
`;

export const CommonHoliday = styled.p`
  font-size: 12px;
  background-color: lightcoral;
`;

export const StyledDiv = styled.div`
  position: relative;
  text-align: center;
`;

export const PrevButton = styled.button`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  left: 550px;

  &::after {
    content: "";
    position: absolute;
    top: 6px;
    left: 7px;
    border-left: 5px solid black;
    border-bottom: 5px solid black;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
  }
`;

export const NextButton = styled.button`
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  left: 720px;

  &::after {
    content: "";
    position: absolute;
    top: 6px;
    left: 4px;
    border-right: 5px solid black;
    border-bottom: 5px solid black;
    width: 10px;
    height: 10px;
    transform: rotate(-45deg);
  }
`;
