import Link from 'next/link'
import { BsDash, BsDot } from 'react-icons/bs'

import { IPlanDataItem } from '../../features/plan/planSlice'
import {
  formatDate,
  formatSpeaker,
  formatLecture,
} from '../../utils/formatters/formatters'

import styles from './History.module.css'

export enum HistoryType {
  LECTURE = 'lecture',
  SPEAKER = 'speaker',
}

interface IHistoryProps {
  data: IPlanDataItem[]
  type: HistoryType
}

const History = ({ data, type }: IHistoryProps): JSX.Element => {
  const format = type === HistoryType.LECTURE ? formatLecture : formatSpeaker

  if (!data.length) return null

  return (
    <>
      <h2>Historia</h2>
      <article>
        <div className={styles.container}>
          {data.map((item) => (
            <div key={item._id} className={styles.row}>
              <BsDot className={styles.mark} />
              <Link href={`/plan/${item._id}`}>
                <a className={styles.date}>{formatDate(item.date)}</a>
              </Link>
              {item[type]?._id && (
                <>
                  <BsDash className={styles.dash} />
                  <Link href={`/${type}s/${item[type]._id}`}>
                    <a className={styles.detail}>
                      <small>{format(item[type])}</small>
                    </a>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </article>
    </>
  )
}

export default History
