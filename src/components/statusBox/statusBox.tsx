import React from 'react'
import { Button } from '@/components/ui/button'
import StatusText from './statusText'
import styles from './statusBox.module.css'

interface StatusBoxProps {
    num: number;
    text: string;
    active?: boolean;
}

const StatusBox: React.FC<StatusBoxProps> = ({ num, text, active }) => {
    return (
            <Button
                className={styles.Button + (active ? ' ' + styles.active : '')}
                style={active ? { backgroundColor: '#dcdcdc' } : {}}
            >
                <StatusText num={num} text={text} />
            </Button>
    )
}

export default StatusBox