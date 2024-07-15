import React, { useState } from "react";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import AddCardForm from "./AddCardForm";
import { ITodo } from "../types";
import axiosInstance from "../axiosConfig";
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";

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
  flex-shrink: 0; /* 추가: 칼럼 크기 고정 */
`;

const Title = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: 10px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 10px;
  top: 40px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 120px;
  z-index: 100;
`;

const MenuItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #f1f1f1;
  }
`;

interface IColumnProps {
  columnId: number;
  columnName: string;
  toDos: ITodo[];
  boardId: number;
  index: number;
  moveColumn?: (dragIndex: number, hoverIndex: number) => void; // 선택적 속성으로 변경
}

const Column = ({
  columnId,
  columnName,
  toDos = [],
  boardId,
  index,
  moveColumn,
}: IColumnProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newColumnName, setNewColumnName] = useState(columnName);

  const handleDeleteColumn = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this column?"
    );
    if (confirmDelete) {
      try {
        await axiosInstance.delete(`/columns/${columnId}`);
        window.location.reload();
      } catch (error) {
        console.error("Failed to delete column:", error);
      }
    }
  };

  const handleEditColumn = async () => {
    if (isEditing) {
      try {
        await axiosInstance.put(`/columns/${columnId}`, {
          columnName: newColumnName,
        });
        window.location.reload();
      } catch (error) {
        console.error("Failed to edit column:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <Droppable droppableId={`column-${columnId}`} type="CARD">
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <Wrapper
          ref={provided.innerRef}
          {...provided.droppableProps}
          $isDraggingOver={snapshot.isDraggingOver}
        >
          <div style={{ position: "relative" }}>
            {isEditing ? (
              <input
                type="text"
                value={newColumnName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewColumnName(e.target.value)
                }
                onBlur={handleEditColumn}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    handleEditColumn();
                  }
                }}
              />
            ) : (
              <Title>{columnName}</Title>
            )}
            <MoreButton onClick={() => setShowMenu(!showMenu)}>⋮</MoreButton>
            {showMenu && (
              <DropdownMenu>
                <MenuItem onClick={handleEditColumn}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteColumn}>Delete</MenuItem>
              </DropdownMenu>
            )}
          </div>
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
