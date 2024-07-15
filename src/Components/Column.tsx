import React from "react";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import AddCardForm from "./AddCardForm";
import { ITodo } from "../types";
import { Droppable, Draggable } from "react-beautiful-dnd";

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
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
}

const Column = ({
  columnId,
  columnName,
  toDos = [],
  boardId,
  index,
  moveColumn,
}: IColumnProps) => {
  return (
    <Draggable draggableId={`column-${columnId}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={`column-${columnId}`} type="CARD">
            {(provided, snapshot) => (
              <Wrapper
                ref={provided.innerRef}
                {...provided.droppableProps}
                $isDraggingOver={snapshot.isDraggingOver}
              >
                <Title>{columnName}</Title>
                <AddCardForm boardId={boardId} columnId={columnId} />
                {toDos.map((toDo, index) => (
                  <DraggableCard key={toDo.id} toDo={toDo} index={index} />
                ))}
                {provided.placeholder}
              </Wrapper>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
