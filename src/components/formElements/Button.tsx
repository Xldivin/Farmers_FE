import React from 'react';
import { Button } from '@mui/material';

interface ICustomButtonProps {
  label: string;
  type: 'button'| 'submit' | 'reset';
  containerStyle: React.CSSProperties;
  onClick?: () => void;
}

export default function CustomButton({ label, type, containerStyle }: ICustomButtonProps) {
  return (
    <Button
      style={containerStyle} // Use the passed containerStyle prop
      type={type}
    >
      {label}
    </Button>
  );
}
