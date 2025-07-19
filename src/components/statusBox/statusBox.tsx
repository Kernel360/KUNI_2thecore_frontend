import React from 'react'
import { Button } from '@/components/ui/button'
import StatusText from './statusText'
import styles from './statusBox.module.css'

interface StatusBoxProps {
    num: number;
    text: string;
}

const StatusBox: React.FC<StatusBoxProps> = ({ num, text }) => {
    return (
        <div>
            <Button className={styles.Button}>
                <StatusText num={num} text={text} />
            </Button>
        </div>
    )
}

export default StatusBox