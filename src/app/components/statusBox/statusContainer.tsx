import React from 'react'

const statusContainer = () => {
    return (
        <div>
            <StatusBox num={100} text="전체 차량" />
            <StatusBox num={57} text="운행 중" />
            <StatusBox num={13} text="대기 중" />
            <StatusBox num={50} text="수리 중" />
        </div>
    )
}

export default statusContainer