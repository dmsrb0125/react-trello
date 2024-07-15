import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosConfig";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: skyblue;
`;

const Title = styled.h2`
  font-size: 40px;
  margin-bottom: 10px;
`;

const Divider = styled.hr`
  width: 100%;
  border: 1px solid #ccc;
  margin: 20px 0;
`;

const BoardList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BoardItem = styled.li`
  height: 100px;
  padding: 20px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  width: 300px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: white;
`;

const BoardName = styled.h3`
  font-size: 20px;
  margin: 0 0 10px 0;
`;

const BoardDescription = styled.p`
  margin: 0;
  color: gray;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
`;

const Main = () => {
  const [boards, setBoards] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const response = await axiosInstance.get("/boards");
      console.log("Boards fetched:", response.data);
      setBoards(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Failed to fetch boards:", error);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleBoardCreate = () => {
    navigate("/board-create");
  };

  const handleBoardClick = (boardId: number) => {
    console.log(`Navigating to board with ID: ${boardId}`);
    navigate(`/board/${boardId}`, { state: { inputValue: "board" + boardId } });
  };

  return (
    <Wrapper>
      <Title>Your Boards</Title>
      <Divider />
      <BoardList>
        {boards.map((board) => (
          <BoardItem
            key={board.boardId}
            onClick={() => handleBoardClick(board.boardId)}
          >
            <BoardName>{board.boardName}</BoardName>
            {board.boardDescription && (
              <BoardDescription>{board.boardDescription}</BoardDescription>
            )}
          </BoardItem>
        ))}
      </BoardList>
      <Divider />
      <Button onClick={handleBoardCreate}>Create Board</Button>
    </Wrapper>
  );
};

export default Main;
