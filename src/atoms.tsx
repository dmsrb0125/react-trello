// src/atoms.ts
import { atom } from "recoil";

export interface ITodo {
  id: number;
  text: string;
  columnId: number;
  columnName: string;
}

export interface IToDoState {
  [key: number]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDoState",
  default: {},
});
