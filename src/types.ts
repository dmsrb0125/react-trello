export interface TaskColumnDto {
  id: number;
  columnName: string;
}

export interface ITodo {
  id: number;
  cardName: string;
  cardDescription: string | null;
  dueDate: string | null;
  cardOrder: number;
  taskColumn: TaskColumnDto;
  checklist: any[];
  commentList: any[];
}

export interface TaskColumnResponseDto {
  id: number;
  columnName: string;
  columnOrder: number;
}

export interface IColumnProps {
  columnId: number;
  columnName: string;
  toDos: ITodo[];
  boardId: number;
  index: number;
  moveColumnLeft: (index: number) => void;
  moveColumnRight: (index: number) => void;
}
