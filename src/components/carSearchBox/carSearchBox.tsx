import React from 'react'
import { Input } from '../ui/input';
import { Button } from "../ui/button";

const carSearchBox = () => {
    return (
        <div style={{ height: "300px", width: "80%", backgroundColor: "white" }}>

            <Input type="carNumber" placeholder="차량 번호 검색" style={{ width: "200px", height: "50px" }} />
            <Button type="submit" variant="outline">
                검색
            </Button>
        </div>
    )
}

export default carSearchBox