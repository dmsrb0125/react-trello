import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { ITodo } from "../atoms";

const Area = styled.div<{
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
  min-width: 300px;
`;

const Wrapper = styled.div`
  padding: 20px 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IColumnProps {
  boardId: string;
  columnId: string;
  columnName: string;
  toDos: ITodo[];
}

const Column: React.FC<IColumnProps> = ({
  boardId,
  columnId,
  columnName,
  toDos,
}) => {
  return (
    <Wrapper>
      <Title>{columnName}</Title>
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <Area
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
            isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
            {...provided.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                index={index}
                toDoId={toDo.id}
                toDoText={toDo.text}
              />
            ))}
            {provided.placeholder}
          </Area>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default Column;
