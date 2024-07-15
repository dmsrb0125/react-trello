import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import { toDoState, IToDoState } from "../atoms";
import Column from "./Column";
import AddColumnButton from "./AddColumnButton";
import { TaskColumnResponseDto } from "../types";
import axiosInstance from "../axiosConfig";

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

const BoardWrapper: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [toDos, setToDos] = useRecoilState<IToDoState>(toDoState);
  const [columns, setColumns] = useState<TaskColumnResponseDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!boardId) {
      setError("Board ID is missing");
      return;
    }

    const fetchColumnsAndTodos = async () => {
      try {
        const response = await axiosInstance.get(`/boards/${boardId}/columns`);
        const columnsData: TaskColumnResponseDto[] = response.data.data;

        // Validate if each column has an id
        const validColumns = columnsData.filter(
          (column) => column.id !== undefined
        );

        if (validColumns.length !== columnsData.length) {
          throw new Error("Some columns are missing id property");
        }

        setColumns(validColumns);

        // Initialize toDos state with fetched columns
        const initialToDos: IToDoState = {};
        validColumns.forEach((column) => {
          initialToDos[column.id] = [];
        });
        setToDos(initialToDos);
      } catch (error) {
        console.error("Failed to fetch columns and todos:", error);
        setError("Failed to fetch columns and todos");
      }
    };

    fetchColumnsAndTodos();
  }, [boardId, setToDos]);

  const onDragEnd = (result: DropResult) => {
    // Handle drag and drop functionality
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Columns>
          {columns.map((column) => (
            <Column
              key={column.id}
              boardId={Number(boardId)}
              columnId={column.id}
              columnName={column.columnName}
              toDos={toDos[column.id] || []}
            />
          ))}
        </Columns>
        <AddColumnButton boardId={Number(boardId)} setColumns={setColumns} />
      </Wrapper>
    </DragDropContext>
  );
};

export default BoardWrapper;
