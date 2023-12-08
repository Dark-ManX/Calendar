import styled from "styled-components";

export const StyledTableHead = styled.thead`
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
