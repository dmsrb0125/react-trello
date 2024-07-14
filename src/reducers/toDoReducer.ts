import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ToDo {
  id: number;
  text: string;
}

interface ToDoState {
  toDos: ToDo[];
  isAuthenticated: boolean;
}

const initialState: ToDoState = {
  toDos: [],
  isAuthenticated: false,
};

const toDoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addToDo: (state, action: PayloadAction<string>) => {
      state.toDos.push({
        id: Date.now(),
        text: action.payload,
      });
    },
    removeToDo: (state, action: PayloadAction<number>) => {
      state.toDos = state.toDos.filter((toDo) => toDo.id !== action.payload);
    },
    updateToDo: (
      state,
      action: PayloadAction<{ id: number; text: string }>
    ) => {
      const todo = state.toDos.find((toDo) => toDo.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
      }
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { addToDo, removeToDo, updateToDo, setIsAuthenticated } =
  toDoSlice.actions;
export default toDoSlice.reducer;
