import React, { createContext, useContext, useState, ReactNode } from "react";
import { ITodo } from "./types";

interface IToDoContext {
  toDos: { [key: number]: ITodo[] };
  setToDos: React.Dispatch<React.SetStateAction<{ [key: number]: ITodo[] }>>;
}

const ToDoContext = createContext<IToDoContext | undefined>(undefined);

export const ToDoProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toDos, setToDos] = useState<{ [key: number]: ITodo[] }>({});

  return (
    <ToDoContext.Provider value={{ toDos, setToDos }}>
      {children}
    </ToDoContext.Provider>
  );
};

export const useToDoContext = (): IToDoContext => {
  const context = useContext(ToDoContext);
  if (!context) {
    throw new Error("useToDoContext must be used within a ToDoProvider");
  }
  return context;
};
