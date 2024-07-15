// src/Components/ColumnWrapper.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Column from "./Column";
import { toDoState, IToDoState, ITodo } from "../atoms"; // ITodo 가져오기

interface IColumnProps {
  columnId: number;
  columnName: string;
  toDos: ITodo[];
  boardId: string;
}

const ColumnWrapper: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const toDos = useRecoilValue<IToDoState>(toDoState);

  if (!boardId || !toDos) {
    return <div>Board not found</div>;
  }

  return (
    <div>
      {Object.keys(toDos).map((columnId) => (
        <Column
          key={columnId}
          boardId={Number(boardId)}
          columnId={Number(columnId)}
          columnName={toDos[Number(columnId)][0].columnName} // columnName을 얻는 부분 수정
          toDos={toDos[Number(columnId)]}
        />
      ))}
    </div>
  );
};

export default ColumnWrapper;
