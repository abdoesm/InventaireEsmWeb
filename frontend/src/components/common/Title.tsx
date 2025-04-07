import React from 'react'

interface TitleProps {
  name: string;
}

export const Title: React.FC<TitleProps> = ({ name }) => {
  return (
    <h2 className="fw-bold text-center flex-grow-1">{name}</h2>
  );
};
