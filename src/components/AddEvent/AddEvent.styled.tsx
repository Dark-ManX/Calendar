import styled from "styled-components";

export const StyledDiv = styled.div`
  position: relative;
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;

  &::before {
    content: "";
    border-bottom: 3px solid black;
    position: absolute;
    top: -10px;
    left: 5px;
    width: 20px;
    height: 20px;
    transform: rotate(45deg);
  }

  &::after {
    content: "";
    border-bottom: 3px solid black;
    position: absolute;
    top: -10px;
    left: -9px;
    width: 20px;
    height: 20px;
    transform: rotate(-45deg);
  }
`;

export const EventTitle = styled.p`
  font-size: 25px;
`;
