import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Column from "./Column";
import { TaskColumnResponseDto } from "../types";
import axiosInstance from "../axiosConfig";
import { useToDoContext } from "../ToDoContext";

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
  const { toDos, setToDos } = useToDoContext();
  const [columns, setColumns] = useState<TaskColumnResponseDto[]>([]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await axiosInstance.get(`/boards/${boardId}/columns`);
        setColumns(response.data.data);
      } catch (error) {
        console.error("Failed to fetch columns:", error);
      }
    };

    fetchColumns();
  }, [boardId]);

  const onDragEnd = (info: any) => {
    const { destination, source } = info;
    if (!destination) return;

    setToDos((allBoards: any) => {
      const sourceBoard = [
        ...allBoards[source.droppableId as unknown as number],
      ];
      const destinationBoard = [
        ...allBoards[destination.droppableId as unknown as number],
      ];
      const [movedTask] = sourceBoard.splice(source.index, 1);

      if (destination.droppableId === source.droppableId) {
        sourceBoard.splice(destination.index, 0, movedTask);
        return {
          ...allBoards,
          [source.droppableId as unknown as number]: sourceBoard,
        };
      } else {
        destinationBoard.splice(destination.index, 0, movedTask);
        return {
          ...allBoards,
          [source.droppableId as unknown as number]: sourceBoard,
          [destination.droppableId as unknown as number]: destinationBoard,
        };
      }
    });
  };

  if (!boardId) {
    return <div>Board not found</div>;
  }

  return (
    <Wrapper>
      <Columns>
        {columns.map((column, index) => (
          <Column
            key={column.id}
            boardId={parseInt(boardId, 10)}
            columnId={column.id}
            columnName={column.columnName}
            toDos={toDos[column.id] || []}
            index={index} // index 추가
          />
        ))}
      </Columns>
    </Wrapper>
  );
};

export default Board;
