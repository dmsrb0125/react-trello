import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import AddCardForm from "./AddCardForm";
import { ITodo } from "../types";
import axiosInstance from "../axiosConfig";

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

const Input = styled.input`
  font-size: 18px;
  margin-bottom: 10px;
  border: none;
  border-bottom: 2px solid #007bff;
`;

const Button = styled.button`
  padding: 5px;
  font-size: 14px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  margin-left: 5px;
`;

const MoveButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const MoveButton = styled(Button)`
  background-color: #6c757d;
  margin: 0 5px;
`;

interface IColumnProps {
  columnId: number;
  columnName: string;
  toDos: ITodo[];
  boardId: number;
  index: number;
  moveColumnLeft: (index: number) => void;
  moveColumnRight: (index: number) => void;
}

const Column = ({
  columnId,
  columnName,
  toDos,
  boardId,
  index,
  moveColumnLeft,
  moveColumnRight,
}: IColumnProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newColumnName, setNewColumnName] = useState(columnName);

  const handleColumnDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const confirmed = window.confirm(
      "Are you sure you want to delete this column?"
    );
    if (confirmed) {
      try {
        await axiosInstance.delete(`/columns/${columnId}`);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete column:", error);
      }
    }
  };

  const handleColumnEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/columns/${columnId}`, {
        columnName: newColumnName,
      });
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to edit column:", error);
    }
  };

  return (
    <Droppable droppableId={String(columnId)}>
      {(provided, snapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.droppableProps}
          $isDraggingOver={snapshot.isDraggingOver}
        >
          {isEditing ? (
            <>
              <Input
                type="text"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
              />
              <Button onClick={handleColumnEdit}>Save</Button>
              <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            </>
          ) : (
            <>
              <Title>{columnName}</Title>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button onClick={handleColumnDelete}>Delete</Button>
            </>
          )}
          <MoveButtonContainer>
            <MoveButton onClick={() => moveColumnLeft(index)}>←</MoveButton>
            <MoveButton onClick={() => moveColumnRight(index)}>→</MoveButton>
          </MoveButtonContainer>
          <AddCardForm boardId={boardId} columnId={columnId} />
          {toDos.map((toDo, index) => (
            <DraggableCard key={toDo.id} toDo={toDo} index={index} />
          ))}
          {provided.placeholder}
        </Wrapper>
      )}
    </Droppable>
  );
};

export default Column;
