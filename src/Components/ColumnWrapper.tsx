import React from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Column from "./Column";
import { toDoState, ITodo } from "../atoms";

interface IToDoState {
  [key: string]: ITodo[];
}

const ColumnWrapper: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const toDos = useRecoilValue<IToDoState>(toDoState);

  if (!boardId || !toDos) {
    return <div>Board not found</div>;
  }

  return (
    <div>
      {["To Do", "Doing", "Done"].map((columnId) => (
        <Column
          key={columnId}
          boardId={boardId}
          columnId={columnId}
          toDos={toDos[columnId]}
        />
      ))}
    </div>
  );
};

export default ColumnWrapper;
