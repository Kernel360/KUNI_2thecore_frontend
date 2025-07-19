import React from 'react'
import StatusBox from './statusBox'

const StatusContainer = () => {
    return (
        <div style={{
            display: 'flex', justifyContent: 'center', width: '100%', gap: '25px', marginTop: '20px'
        }}>
            <StatusBox num={100} text="전체 차량" />
            <StatusBox num={57} text="운행 중" />
            <StatusBox num={13} text="대기 중" />
            <StatusBox num={50} text="수리 중" />
        </div>
    )
}

export default StatusContainer