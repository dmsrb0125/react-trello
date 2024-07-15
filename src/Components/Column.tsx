import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import AddCardForm from "./AddCardForm";
import { ITodo } from "../types";

interface WrapperProps {
  isDraggingOver: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  background-color: ${(props) =>
    props.isDraggingOver ? "#dfe6e9" : props.theme.boardColor};
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
}

const Column = ({
  columnId,
  columnName,
  toDos = [], // Default value
  boardId,
}: IColumnProps) => {
  return (
    <Droppable droppableId={String(columnId)}>
      {(provided, snapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
        >
          <Title>{columnName}</Title>
          <AddCardForm boardId={boardId} columnId={columnId} />
          {toDos.map((toDo, index) => (
            <DraggableCard
              key={toDo.id}
              toDoId={toDo.id}
              toDoText={toDo.text}
              index={index}
            />
          ))}
          {provided.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
};

export default Column;
