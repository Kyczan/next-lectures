import { makeStore, AppStore } from '../../app/store'
import {
  fetchSpeakers,
  addSpeaker,
  updateSpeaker,
  deleteSpeaker,
  ISpeakersDataItem,
  selectSpeakers,
  selectSpeakerById,
} from './speakersSlice'
import speakersDataImport from '../../../__mocks__/data/speakers.json'

describe('speakersSlice', () => {
  const speakersData: ISpeakersDataItem[] = speakersDataImport
  const [speaker] = speakersData
  let store: AppStore
  beforeEach(() => {
    store = makeStore()
    fetchMock.resetMocks()
  })

  describe('fetchSpeakers', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify(speakersData))
      await store.dispatch(fetchSpeakers())
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.speakers.data).toEqual(speakersData)
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 404 })
      await store.dispatch(fetchSpeakers())
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.speakers.fetch.error).toEqual('Not Found')
    })
  })

  describe('addSpeaker', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify(speaker))
      await store.dispatch(addSpeaker(speaker))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.speakers.data).toEqual([speaker])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(addSpeaker(speaker))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.speakers.add.error).toEqual('Bad Request')
    })
  })

  describe('updateSpeaker', () => {
    it('handles success', async () => {
      const modifiedSpeaker = {
        ...speaker,
        title: 'Changed title',
      }
      fetchMock.once(JSON.stringify([speaker]))
      await store.dispatch(fetchSpeakers())

      fetchMock.once(JSON.stringify(modifiedSpeaker))
      await store.dispatch(updateSpeaker(modifiedSpeaker))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.speakers.data).toEqual([modifiedSpeaker])
    })

    it('handles bad _id', async () => {
      const modifiedSpeaker = {
        ...speaker,
        _id: 'badId',
        title: 'Changed title',
      }
      fetchMock.once(JSON.stringify([speaker]))
      await store.dispatch(fetchSpeakers())

      fetchMock.once(JSON.stringify(modifiedSpeaker))
      await store.dispatch(updateSpeaker(modifiedSpeaker))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.speakers.data).toEqual([speaker])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(updateSpeaker(speaker))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.speakers.update.error).toEqual('Bad Request')
    })
  })

  describe('deleteSpeaker', () => {
    it('handles success', async () => {
      fetchMock.once(JSON.stringify([speaker]))
      await store.dispatch(fetchSpeakers())

      fetchMock.once(JSON.stringify({}))
      await store.dispatch(deleteSpeaker(speaker))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.speakers.data).toEqual([])
    })

    it('handles bad _id', async () => {
      const modifiedSpeaker = {
        ...speaker,
        _id: 'badId',
        title: 'Changed title',
      }
      fetchMock.once(JSON.stringify([speaker]))
      await store.dispatch(fetchSpeakers())

      fetchMock.once(JSON.stringify({}))
      await store.dispatch(deleteSpeaker(modifiedSpeaker))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(appState.speakers.data).toEqual([speaker])
    })

    it('handles bad status response', async () => {
      fetchMock.once(null, { status: 400 })
      await store.dispatch(deleteSpeaker(speaker))
      const appState = store.getState()

      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(appState.speakers.delete.error).toEqual('Bad Request')
    })
  })

  describe('selectors', () => {
    it('handle selectSpeakers', async () => {
      fetchMock.once(JSON.stringify(speakersData))
      await store.dispatch(fetchSpeakers())
      const appState = store.getState()

      const { data } = selectSpeakers(appState)
      expect(data).toEqual(speakersData)
    })

    it('handle selectSpeakerById with id', async () => {
      fetchMock.once(JSON.stringify(speakersData))
      await store.dispatch(fetchSpeakers())
      const appState = store.getState()

      const speaker = selectSpeakerById('a')(appState)
      expect(speaker).toEqual(speakersData[0])
    })

    it('handle selectSpeakerById without id', async () => {
      fetchMock.once(JSON.stringify(speakersData))
      await store.dispatch(fetchSpeakers())
      const appState = store.getState()

      const speaker = selectSpeakerById()(appState)
      expect(speaker).toEqual(undefined)
    })
  })
})
