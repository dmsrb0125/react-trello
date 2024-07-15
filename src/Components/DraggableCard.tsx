import React from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";

const Card = styled.div<{ isDragging: boolean }>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${(props) =>
    props.isDragging ? "#e4f2ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

interface IDragabbleCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDragabbleCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id: toDoId, index },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <Card isDragging={isDragging} ref={drag}>
      {toDoText}
    </Card>
  );
}

export default React.memo(DraggableCard);
