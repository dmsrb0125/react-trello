import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { ITodo } from "../types";

interface ICardProps {
  toDo: ITodo;
  index: number;
}

const Card: React.FC<ICardProps> = ({ toDo, index }) => {
  return (
    <Draggable draggableId={`task-${toDo.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            userSelect: "none",
            padding: 16,
            margin: "0 0 8px 0",
            minHeight: "50px",
            backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
            color: "white",
            ...provided.draggableProps.style,
          }}
        >
          {toDo.cardName}
        </div>
      )}
    </Draggable>
  );
};

export default Card;
