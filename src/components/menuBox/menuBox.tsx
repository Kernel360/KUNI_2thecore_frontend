import React from 'react'
import { Button } from "@/components/ui/button"
import styles from './menuBox.module.css'

const MenuBox = () => {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-start', flexDirection: 'row'
    }}>
      <div className={styles.greyBox}>
        <Button className={styles.Button}>🗺️ 지도</Button>
        <Button className={styles.Button}>🚗 차량 검색</Button>
        <Button className={styles.Button}>📊 주행 기록 및 경로</Button>
        <Button className={styles.Button}>⚒️ 차량 관리</Button>
      </div>
    </div>
  )
}

export default MenuBox
