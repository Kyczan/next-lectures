import { SortOrder, IFilter } from '../../app/types'

export const applyFilter = <DataType>(
  data: DataType[],
  filter: IFilter<string, string>
): DataType[] => {
  const { search, sort } = filter

  const resolvePath = (object, path) =>
    path.split('.').reduce((o, p) => o?.[p], object)

  const filtered =
    search && search.value
      ? data.filter((item) =>
          search.keys.some((key) =>
            resolvePath(item, key)
              ?.toLowerCase()
              ?.includes(search.value.toLowerCase())
          )
        )
      : [...data]

  const asc = sort.order === SortOrder.ASC ? 1 : -1
  filtered.sort((a, b) => {
    const aItem = resolvePath(a, sort.key)
    const bItem = resolvePath(b, sort.key)
    if (!aItem) return -asc
    if (!bItem) return asc
    return aItem.localeCompare(bItem, 'pl', { numeric: true }) * asc
  })

  return filtered
}
