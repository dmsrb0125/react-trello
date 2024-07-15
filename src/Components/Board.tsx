import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { toDoState, ITodo } from "../atoms";
import Column from "./Column";
import { useParams } from "react-router-dom";

interface IToDoState {
  [key: string]: ITodo[];
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const Columns = styled.div`
  display: flex;
  width: 100%;
  max-width: 1200px;
  gap: 10px;
`;

const Board: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [toDos, setToDos] = useRecoilState<IToDoState>(toDoState);

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (!destination) return;

    setToDos((allBoards) => {
      const sourceBoard = [...allBoards[source.droppableId]];
      const destinationBoard = [...allBoards[destination.droppableId]];
      const [movedTask] = sourceBoard.splice(source.index, 1);

      if (destination.droppableId === source.droppableId) {
        sourceBoard.splice(destination.index, 0, movedTask);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
        };
      } else {
        destinationBoard.splice(destination.index, 0, movedTask);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      }
    });
  };

  if (!boardId) {
    return <div>Board not found</div>;
  }

  // 컬럼 데이터는 실제 API 호출을 통해 받아온 데이터로 대체
  const columns = [
    { id: "1", name: "To Do" },
    { id: "2", name: "Doing" },
    { id: "3", name: "Done" },
  ];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <h2>{boardId}</h2>
        <Columns>
          {columns.map((column) => (
            <Column
              key={column.id}
              boardId={boardId}
              columnId={column.id}
              columnName={column.name} // columnName 속성을 추가
              toDos={toDos[column.name] || []}
            />
          ))}
        </Columns>
      </Wrapper>
    </DragDropContext>
  );
};

export default Board;
