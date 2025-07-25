import React from 'react'
import { DropDown } from './dropdown'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
const BrandFilterBox = () => {
    return (
        <div style={{
            display: "flex", flexDirection: "row", alignItems: "stretch",
            justifyContent: "center", width: "100%",
        }}>
            <DropDown />
            <Input type="text" placeholder="차량명 입력(브랜드 + 모델명)" style={{
                width: "50%", height: "38.5px",
                backgroundColor: "white",
            }} />
            <Button style={{
                width: "7%", height: "44px", marginLeft: "14px",
                backgroundColor: "#0070f3", color: "white",
                fontSize: "14px",
                fontWeight: 500,
            }}>필터 적용</Button>
        </div>

    )
}

export default BrandFilterBox