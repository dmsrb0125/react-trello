import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Column from "./Column";
import { toDoState } from "../atoms";

const ColumnWrapper: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const toDos = useRecoilValue(toDoState);

  if (!boardId || !toDos[boardId]) {
    return <div>Board not found</div>;
  }

  return <Column boardId={boardId} toDos={toDos[boardId]} />;
};

export default ColumnWrapper;
