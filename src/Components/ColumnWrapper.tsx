import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Column from "./Column";
import { toDoState, ITodo } from "../atoms";
import { TaskColumnResponseDto } from "../types"; // TaskColumnResponseDto 타입을 추가합니다.

interface IToDoState {
  [key: string]: ITodo[];
}

const ColumnWrapper: React.FC<{ columns: TaskColumnResponseDto[] }> = ({
  columns,
}) => {
  const { boardId } = useParams<{ boardId: string }>();
  const toDos = useRecoilValue<IToDoState>(toDoState);

  if (!boardId || !toDos) {
    return <div>Board not found</div>;
  }

  return (
    <div>
      {columns.map((column) => (
        <Column
          key={column.columnId}
          boardId={boardId}
          columnId={column.columnId}
          columnName={column.columnName}
          toDos={toDos[column.columnId]}
        />
      ))}
    </div>
  );
};

export default ColumnWrapper;
