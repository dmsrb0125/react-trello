// src/types.ts
export interface ITodo {
  id: number;
  text: string;
  columnId: number; // columnId 속성을 추가합니다.
}

// src/types.ts
export interface TaskColumnResponseDto {
  id: number;
  columnName: string;
  columnOrder: number;
}
