import { FC } from "react";
import { StyledTableHead, StyledRow, StyledHeadData } from "./TableHead.styled";

const TableHead: FC = () => {
  return (
    <StyledTableHead>
      <StyledRow>
        <StyledHeadData>Mon</StyledHeadData>
        <StyledHeadData>Tue</StyledHeadData>
        <StyledHeadData>Wed</StyledHeadData>
        <StyledHeadData>Thu</StyledHeadData>
        <StyledHeadData>Fri</StyledHeadData>
        <StyledHeadData>Sat</StyledHeadData>
        <StyledHeadData>Sun</StyledHeadData>
      </StyledRow>
    </StyledTableHead>
  );
};

export default TableHead;
