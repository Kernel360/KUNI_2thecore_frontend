import React from 'react'
import { Input } from '../ui/input';
import { Button } from "../ui/button";

const NumberSearchBox = () => {
    return (
        <div style={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: 'center', }}>
            <div
                style={{
                    width: '97%',
                    height: '80px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    margin: '8px 0px'

                }}
            >
                <div style={{
                    display: "flex", flexDirection: "row", alignItems: "center",
                    justifyContent: "center", width: "100%", marginTop: "21px",
                }}>
                    <Input type="text" placeholder="차량 번호" style={{
                        width: "80%", height: "38.5px",
                        backgroundColor: "white",
                    }} />
                    <Button style={{
                        width: "7%", height: "44px", marginLeft: "14px",
                        backgroundColor: "#0070f3", color: "white",
                        fontSize: "14px",
                        fontWeight: 500,
                    }}>버튼</Button>
                </div>
            </div>
        </div >
    )
}

export default NumberSearchBox