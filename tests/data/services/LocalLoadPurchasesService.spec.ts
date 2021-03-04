import { LocalLoadPurchasesService } from '@data/services'
import {
	CacheStoreSpy,
	getCacheExpirationDate,
	mockPurchases,
} from '@tests/data/mocks'

type SutTypes = {
	sut: LocalLoadPurchasesService
	cacheStore: CacheStoreSpy
}

function makeSut(timestamp = new Date()): SutTypes {
	const cacheStoreSpy = new CacheStoreSpy()

	const sut = new LocalLoadPurchasesService(cacheStoreSpy, timestamp)

	return {
		sut,
		cacheStore: cacheStoreSpy,
	}
}

describe('LocalLoadPurchases', () => {
	test('should not delete or insert cache on sut.init', () => {
		const { cacheStore } = makeSut()

		expect(cacheStore.actions).toEqual([])
	})

	test('should return an empty if load fails', async () => {
		const { cacheStore, sut } = makeSut()

		cacheStore.simulateFetchError()
		const purchases = await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
		expect(purchases).toEqual([])
	})

	test('should return a list of purchases if cache is valid', async () => {
		const currentDate = new Date()
		const timestamp = getCacheExpirationDate(currentDate)
		timestamp.setSeconds(timestamp.getSeconds() + 1)

		const { cacheStore, sut } = makeSut(timestamp)

		cacheStore.fetchResult = {
			timestamp,
			value: mockPurchases(),
		}

		const purchases = await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
		expect(cacheStore.fetchKey).toBe('purchases')
		expect(purchases).toEqual(cacheStore.fetchResult.value)
	})

	test('should have no side effects if cache is expired', async () => {
		const currentDate = new Date()
		const timestamp = getCacheExpirationDate(currentDate)
		timestamp.setSeconds(timestamp.getSeconds() - 1)

		const { cacheStore, sut } = makeSut(currentDate)

		cacheStore.fetchResult = {
			timestamp,
			value: mockPurchases(),
		}

		const purchases = await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
		expect(cacheStore.fetchKey).toBe('purchases')
		expect(purchases).toEqual([])
	})

	test('should return an empty list if cache is on expiration date', async () => {
		const currentDate = new Date()
		const timestamp = getCacheExpirationDate(currentDate)

		const { cacheStore, sut } = makeSut(currentDate)

		cacheStore.fetchResult = {
			timestamp,
			value: mockPurchases(),
		}

		const purchases = await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
		expect(cacheStore.fetchKey).toBe('purchases')
		expect(purchases).toEqual([])
	})

	test('should return an empty list if cache is empty', async () => {
		const currentDate = new Date()
		const timestamp = getCacheExpirationDate(currentDate)
		timestamp.setSeconds(timestamp.getSeconds() + 1)

		const { cacheStore, sut } = makeSut(timestamp)

		cacheStore.fetchResult = {
			timestamp,
			value: [],
		}

		const purchases = await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
		expect(cacheStore.fetchKey).toBe('purchases')
		expect(purchases).toEqual([])
	})
})
