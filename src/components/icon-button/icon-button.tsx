'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import styles from './icon-button.module.css';

interface IconButtonProps {
  iconType: 'edit' | 'delete';
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconType,
  onClick,
  className,
}) => {
  const getIconPath = () => {
    switch (iconType) {
      case 'edit':
        return '/edit_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
      case 'delete':
        return '/delete_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
    }
  };

  return (
    <Button size="sm" onClick={onClick} className={styles.iconButton}>
      <Image
        src={getIconPath()}
        alt={`${iconType} icon`}
        width={16}
        height={16}
        className={styles.icon}
      />
    </Button>
  );
};

export default IconButton;
