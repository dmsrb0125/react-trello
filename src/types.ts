// src/types.ts
export interface ITodo {
  id: number;
  text: string;
  columnId: number;
}

export interface IToDoState {
  [key: number]: ITodo[];
}

export interface TaskColumnResponseDto {
  id: number;
  columnName: string;
  columnOrder: number;
}
