import React, { createContext, useContext, useState } from "react";
import { IToDoState } from "../types"; // IToDoState를 types에서 가져오기

interface ToDoContextType {
  toDos: IToDoState;
  setToDos: React.Dispatch<React.SetStateAction<IToDoState>>;
}

const ToDoContext = createContext<ToDoContextType | undefined>(undefined);

export const ToDoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toDos, setToDos] = useState<IToDoState>({});

  return (
    <ToDoContext.Provider value={{ toDos, setToDos }}>
      {children}
    </ToDoContext.Provider>
  );
};

export const useToDo = () => {
  const context = useContext(ToDoContext);
  if (context === undefined) {
    throw new Error("useToDo must be used within a ToDoProvider");
  }
  return context;
};

export { ToDoContext }; // export type으로 변경
