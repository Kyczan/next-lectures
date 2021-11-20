import { SortOrder, IFilter } from '../../app/types'

export const applyFilter = <DataType>(
  data: DataType[],
  filter: IFilter<string, string>
): DataType[] => {
  const { search, sort } = filter

  const resolvePath = (object, path) =>
    path.split('.').reduce((o, p) => o?.[p], object)

  const filtered = data.filter((item) =>
    search.keys.some((key) =>
      resolvePath(item, key)
        ?.toLowerCase()
        ?.includes(search.value.toLowerCase())
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
