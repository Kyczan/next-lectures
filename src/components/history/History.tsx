import Link from 'next/link'
import { BsDash, BsFileEarmark } from 'react-icons/bs'

import { IPlanDataItem } from '../../features/plan/planSlice'
import {
  formatDate,
  formatSpeaker,
  formatLecture,
} from '../../utils/formatters/formatters'

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
        <ul>
          {data.map((item) => (
            <li key={item._id}>
              <Link href={`/plan/${item._id}`}>{formatDate(item.date)}</Link>
              {item[type]?._id && (
                <>
                  <BsDash />
                  <Link href={`/${type}s/${item[type]._id}`}>
                    <a>
                      <small>{format(item[type])}</small>
                    </a>
                  </Link>
                </>
              )}
            </li>
          ))}
        </ul>
      </article>
    </>
  )
}

export default History
