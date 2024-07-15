import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { ITodo } from "../types";
import CardModal from "./CardModal";
import styled from "styled-components";

const CardContainer = styled.div`
  position: relative;
  user-select: none;
  padding: 16px;
  margin: 0 0 8px 0;
  min-height: 50px;
  background-color: #456c86;
  color: white;
  cursor: pointer;
`;

interface ICardProps {
  toDo: ITodo;
  index: number;
}

const DraggableCard: React.FC<ICardProps> = ({ toDo, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Draggable draggableId={`task-${toDo.id}`} index={index}>
        {(provided, snapshot) => (
          <CardContainer
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
              ...provided.draggableProps.style,
            }}
            onClick={() => setIsModalOpen(true)}
          >
            {toDo.cardName}
          </CardContainer>
        )}
      </Draggable>
      {isModalOpen && (
        <CardModal toDo={toDo} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default DraggableCard;
