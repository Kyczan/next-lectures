import { applyFilter } from './applyFilter'
import { SortOrder } from '../../app/types'

describe('applyFilter', () => {
  const data = [
    { id: '1', name: 'test 1', optional: 'ok' },
    { id: '2', name: 'test 2' },
    { id: '3', name: 'test 3' },
    { id: '4', name: 'test 4', optional: 'test' },
  ]

  it('searches correctly', () => {
    const filter = {
      search: {
        keys: ['id', 'name', 'optional'],
        value: 'test 2',
      },
      sort: {
        key: 'id',
        order: SortOrder.ASC,
      },
    }
    const filtered = applyFilter([...data], filter)

    expect(filtered.length).toEqual(1)
    expect(filtered).toEqual([data[1]])
  })

  it('sorts correctly', () => {
    const filter = {
      search: {
        keys: ['id', 'name', 'optional'],
        value: '',
      },
      sort: {
        key: 'id',
        order: SortOrder.DESC,
      },
    }
    const filtered = applyFilter([...data], filter)

    expect(filtered.length).toEqual(4)
    expect(filtered[0]).toEqual(data[3])
  })

  it('sorts correctly with missing props', () => {
    const filter = {
      search: {
        keys: ['id', 'name', 'optional'],
        value: '',
      },
      sort: {
        key: 'optional',
        order: SortOrder.DESC,
      },
    }
    const filtered = applyFilter([...data], filter)

    expect(filtered.length).toEqual(4)
    expect(filtered[0]).toEqual(data[3])
  })
})
