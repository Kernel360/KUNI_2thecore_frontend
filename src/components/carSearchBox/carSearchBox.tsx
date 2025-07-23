import React from 'react'
import CarNumberSearchBox from './carNumberSearchBox'
import CarBrandFilterBox from './carBrandFilterBox'
import CarListBox from './listBox/carListBox'
import styles from './carListBox.module.css'
import Status from './status'

const CarSearchBox = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
            <CarNumberSearchBox />
            <CarBrandFilterBox />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: "20px" }}>
                {/*렌더링 관련된건 백엔드 완성되면 수정해보기*/}
                <CarListBox num={"12가 1234"} brand="현대" model="소나타" location="서울" status="운행중" />
                <CarListBox num={"23나 2345"} brand="기아" model="K5" location="동작구" status="대기중" />
                <CarListBox num={"34라 3456"} brand="삼성" model="SM5" location="국민대" status="수리중" />
                <CarListBox num={"34라 3456"} brand="삼성" model="SM5" location="국민대" status="수리중" />
                <CarListBox num={"24파 3456"} brand="BMW" model="E클래스" location="길음" status="운행중" />
                <CarListBox num={"14라 4452"} brand="기아" model="K3" location="홍대대" status="수리중" />
                <CarListBox num={"12가 1234"} brand="현대" model="소나타2" location="속초" status="운행중" />
                <CarListBox num={"34라 1456"} brand="삼성" model="SM4" location="국민대" status="수리중" />
                <CarListBox num={"34라 3436"} brand="삼성" model="SM3" location="국민대" status="수리중" />
            </div>
        </div>
    )
}

export default CarSearchBox