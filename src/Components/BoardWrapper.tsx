import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import axiosInstance from "../axiosConfig";
import { useRecoilValue, useSetRecoilState } from "recoil"; // 변경된 부분
import { toDoState } from "../atoms";
import Column from "./Column";
import AddColumnButton from "./AddColumnButton";
import { TaskColumnResponseDto } from "../types";

const BoardDetail = styled.div`
  padding: 20px;
  background-color: skyblue;
`;

const BoardTitle = styled.h2`
  font-size: 36px;
  text-align: center;
  margin-bottom: 10px;
`;

const BoardDescription = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 20px;
  color: gray;
`;

const Columns = styled.div`
  display: flex;
  gap: 20px;
`;

const BoardWrapper: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const toDos = useRecoilValue(toDoState);
  const setToDos = useSetRecoilState(toDoState);
  const [columns, setColumns] = useState<TaskColumnResponseDto[]>([]);
  const [board, setBoard] = useState<any>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      console.log(`Fetching board with ID: ${boardId}`);
      try {
        const response = await axiosInstance.get(`/boards/${boardId}`);
        console.log("Board data fetched:", response.data);
        if (response.data && response.data.data) {
          setBoard(response.data.data);
        } else {
          console.error("Unexpected response structure", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch board:", error);
      }
    };

    const fetchColumns = async () => {
      try {
        const response = await axiosInstance.get(`/boards/${boardId}/columns`);
        console.log("Columns data fetched:", response.data);
        if (response.data && response.data.data) {
          setColumns(response.data.data);
        } else {
          console.error("Unexpected response structure", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch columns:", error);
      }
    };

    if (boardId) {
      fetchBoard();
      fetchColumns();
    }
  }, [boardId]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === "COLUMN") {
      const newColumnOrder = Array.from(columns);
      const [movedColumn] = newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, movedColumn);
      setColumns(newColumnOrder);
      // TODO: Add API call to save new column order
      return;
    }

    // Handle task dragging
    setToDos((prev: any) => {
      const sourceBoard = [...prev[source.droppableId]];
      const destinationBoard = [...prev[destination.droppableId]];
      const [movedTask] = sourceBoard.splice(source.index, 1);

      if (source.droppableId === destination.droppableId) {
        sourceBoard.splice(destination.index, 0, movedTask);
        return {
          ...prev,
          [source.droppableId]: sourceBoard,
        };
      } else {
        destinationBoard.splice(destination.index, 0, movedTask);
        return {
          ...prev,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      }
    });
  };

  if (!boardId || !board) {
    return <div>Board not found</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <BoardDetail>
        <BoardTitle>{board.boardName}</BoardTitle>
        <BoardDescription>{board.boardDescription}</BoardDescription>
        <Columns>
          {columns.map((column) => (
            <Column
              key={column.columnId}
              boardId={boardId}
              columnId={column.columnId}
              columnName={column.columnName}
              toDos={toDos[column.columnName] || []}
            />
          ))}
        </Columns>
        <AddColumnButton boardId={boardId} />
      </BoardDetail>
    </DragDropContext>
  );
};

export default BoardWrapper;
