import React from "react";
import styled from "styled-components";
import { ITodo } from "../types";

interface ICardModalProps {
  toDo: ITodo;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 800px;
  max-height: 80vh; /* 최대 높이 설정 */
  overflow-y: auto; /* 내용이 넘칠 경우 스크롤 가능 */
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const CardModal: React.FC<ICardModalProps> = ({ toDo, onClose }) => {
  return (
    <Overlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>{toDo.cardName}</h2>
        <p>{toDo.cardDescription}</p>
        <p>Due Date: {toDo.dueDate}</p>
        <h3>Checklist</h3>
        <ul>
          {toDo.checklist.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h3>Comments</h3>
        <ul>
          {toDo.commentList.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
      </ModalContainer>
    </Overlay>
  );
};

export default CardModal;
