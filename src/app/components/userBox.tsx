import React from 'react'
import { Button } from "./ui/button"
import styles from './userBox.module.css'

const UserBox = () => {
  return (
    <div className={styles.div}>
      <h5>관리자님</h5>
      <Button className={styles.Button}>로그아웃</Button>
    </div>
  )
}
export default UserBox
