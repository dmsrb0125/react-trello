import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DragabbleCard";
import { ITodo } from "../atoms";

const ColumnWrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
  padding: 20px;
  border-radius: 10px;
  min-width: 300px; /* Adjusted width */
  max-width: 300px; /* Adjusted width */
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

const Form = styled.form`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
`;

interface TaskListProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const TaskList = styled.div<TaskListProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
  border-radius: 5px;
`;

interface IColumnProps {
  boardId: string;
  columnId: string;
  toDos: ITodo[];
}

const Column: React.FC<IColumnProps> = ({ boardId, columnId, toDos }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <ColumnWrapper>
          <Title>{columnId}</Title>
          <Form>
            <Input
              name="toDo"
              type="text"
              placeholder={`Add task on ${columnId}`}
            />
          </Form>
          <TaskList
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
          </TaskList>
        </ColumnWrapper>
      )}
    </Droppable>
  );
};

export default Column;
