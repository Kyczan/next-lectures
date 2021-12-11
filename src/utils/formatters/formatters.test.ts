import { formatLecture, formatSpeaker, formatDate } from './formatters'

describe('formatLecture', () => {
  it('returns empty sting when no speaker provided', () => {
    const formatted = formatLecture(null)

    expect(formatted).toEqual('')
  })

  it('formats lecture', () => {
    const lecture = {
      number: 'Number',
      title: 'Title',
    }
    const formatted = formatLecture(lecture)

    expect(formatted).toEqual('Number. Title')
  })
})

describe('formatSpeaker', () => {
  it('returns empty sting when no speaker provided', () => {
    const formatted = formatSpeaker(null)

    expect(formatted).toEqual('')
  })

  it('formats speaker without congregation', () => {
    const speaker = {
      name: 'Name',
    }
    const formatted = formatSpeaker(speaker)

    expect(formatted).toEqual('Name')
  })

  it('formats speaker with congregation', () => {
    const speaker = {
      name: 'Name',
      congregation: 'Congregation',
    }
    const formatted = formatSpeaker(speaker)

    expect(formatted).toEqual('Name (Congregation)')
  })
})

describe('formatDate', () => {
  it('returns empty sting when no date provided', () => {
    const formatted = formatDate(null)

    expect(formatted).toEqual(undefined)
  })

  it('formats date with default param fullDate set to true', () => {
    const formatted = formatDate('2021-12-12')

    expect(formatted).toEqual('12 grudnia 2021')
  })

  it('formats date with param fullDate set to false', () => {
    const formatted = formatDate('2021-12-12', false)

    expect(formatted).toEqual('grudzień 2021')
  })
})
