import React from 'react';
import { Button } from '@mui/material';

interface ICustomButtonProps {
  label: string;
  type: 'button'| 'submit' | 'reset';
  containerStyle: React.CSSProperties;
  onClick?: () => void;
  disabled?: boolean; 
}

export default function CustomButton({ label, type, containerStyle, onClick, disabled }: ICustomButtonProps) {
  return (
    <Button
      style={containerStyle}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
}
