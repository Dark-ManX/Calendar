import styled from "styled-components";

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

export const CommonHoliday = styled.p`
  margin: 2px;
  font-size: 12px;
  background-color: lightcoral;
  cursor: pointer;
`;

export const Text = styled.p`
  font-weight: bold;
`;

export const Div = styled.div`
  display: block;
  width: 100%;
  margin: 1px;
`;
