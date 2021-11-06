import { SortOrder, IFilter } from '../../app/types'

export const applyFilter = <T>(data: T[], filter: IFilter): T[] => {
  const { search, sort } = filter

  const filtered = data.filter((item) =>
    search.keys.some((key) =>
      item[key].toLowerCase().includes(search.value.toLowerCase())
    )
  )

  const asc = sort.order === SortOrder.ASC ? 1 : -1
  filtered.sort((a, b) => {
    if (!a[sort.key]) return -asc
    if (!b[sort.key]) return asc
    return a[sort.key].localeCompare(b[sort.key], 'pl', { numeric: true }) * asc
  })

  return filtered
}
