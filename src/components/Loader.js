import React from 'react'
import styles from './Loader.module.css'
import Spinner from "react-activity/dist/Spinner"
import "react-activity/dist/Spinner.css";
import { useSelector } from "react-redux";

let Loader = () => {
    let { user,color } = useSelector(state => state.userAuth)

    return <div className={styles.modal_screen}>
        <div className={styles.modal_center}>
            <div className={styles.modal_input_card}>
                <div className={styles.modal_heading_con}>
                    <Spinner size={40} className={styles.loader} speed={.5}/>
                </div>
            </div>

        </div>

    </div>
}

export default Loader