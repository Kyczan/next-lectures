import { BsCalendar4 } from 'react-icons/bs'

import styles from './CalendarCard.module.css'

interface ICalendarCardProps {
  day: number | string
}

const CalendarCard = ({ day }: ICalendarCardProps): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <BsCalendar4 className={styles.icon} />
      <div className={styles.day}>{day}</div>
    </div>
  )
}

export default CalendarCard
