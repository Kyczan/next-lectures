export const formatLecture = (lecture) => {
  if (!lecture || !lecture.number || !lecture.title) return ''

  return `${lecture.number}. ${lecture.title}`
}

export const formatSpeaker = (speaker) => {
  if (!speaker || !speaker.name) return ''

  const congregation = speaker.congregation ? ` (${speaker.congregation})` : ''
  return `${speaker.name}${congregation}`
}

export const formatDate = (str, fullDate = true) => {
  if (!str) return

  const date = new Date(str)
  const options = fullDate
    ? ({ year: 'numeric', month: 'long', day: 'numeric' } as const)
    : ({ month: 'long', year: 'numeric' } as const)
  return new Intl.DateTimeFormat('pl-PL', options).format(date)
}
