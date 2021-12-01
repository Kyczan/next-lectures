import useSWR, { mutate } from 'swr'

import { fetcher } from '../api'

export const useLectures = () => {
  const { data, error } = useSWR('/api/lectures', fetcher)

  return {
    lectures: data,
    isLoading: !error && !data,
    isError: !!error,
  }
}

export const useLectureById = (id) => {
  const { data, error } = useSWR(id ? `/api/lectures/${id}` : null, fetcher)

  return {
    lecture: data,
    isLoading: !error && !data,
    isError: !!error,
  }
}

export const addLecture = async (lecture) => {
  await fetch('/api/lectures', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lecture),
  })

  await mutate('/api/lectures')
}

export const editLecture = async (lecture) => {
  await fetch(`/api/lectures/${lecture._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lecture),
  })

  await mutate(`/api/lectures/${lecture._id}`)
}

export const deleteLecture = async (lecture) => {
  await fetch(`/api/lectures/${lecture._id}`, {
    method: 'DELETE',
  })

  await mutate('/api/lectures')
}
