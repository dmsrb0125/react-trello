import React from "react";
import { useDrop, useDrag } from "react-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import AddCardForm from "./AddCardForm";
import { ITodo } from "../types";

interface WrapperProps {
  $isDraggingOver: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  background-color: ${(props) =>
    props.$isDraggingOver ? "#dfe6e9" : props.theme.boardColor};
  padding: 10px;
  border-radius: 5px;
  min-height: 300px;
  width: 300px;
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

interface IColumnProps {
  columnId: number;
  columnName: string;
  toDos: ITodo[];
  boardId: number;
  index: number; // 추가
}

const Column = ({
  columnId,
  columnName,
  toDos = [],
  boardId,
  index,
}: IColumnProps) => {
  const [{ isOver }, drop] = useDrop({
    accept: "CARD",
    drop: () => ({ columnId }),
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{ isDragging }, drag] = useDrag({
    type: "COLUMN",
    item: { index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Wrapper ref={drop} $isDraggingOver={isOver}>
      <div ref={drag}>
        <Title>{columnName}</Title>
      </div>
      <AddCardForm boardId={boardId} columnId={columnId} />
      {toDos.map((toDo, index) => (
        <DraggableCard
          key={toDo.id}
          toDoId={toDo.id}
          toDoText={toDo.text}
          index={index}
        />
      ))}
    </Wrapper>
  );
};

export default Column;
