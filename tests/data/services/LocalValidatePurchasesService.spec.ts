import { LocalLoadPurchasesService } from '@data/services'
import { CacheStoreSpy, getCacheExpirationDate } from '@tests/data/mocks'

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

describe('LocalValidatePurchases', () => {
	test('should not delete or insert cache on sut.init', () => {
		const { cacheStore } = makeSut()

		expect(cacheStore.actions).toEqual([])
	})

	test('should delete cache if load fails', () => {
		const { cacheStore, sut } = makeSut()

		cacheStore.simulateFetchError()
		sut.validate()

		expect(cacheStore.actions).toEqual([
			CacheStoreSpy.Action.fetch,
			CacheStoreSpy.Action.delete,
		])
		expect(cacheStore.deleteKey).toEqual('purchases')
	})

	test('should has no side effect if load succeeds', () => {
		const currentDate = new Date()
		const timestamp = getCacheExpirationDate(currentDate)
		timestamp.setSeconds(timestamp.getSeconds() + 1)

		const { cacheStore, sut } = makeSut(timestamp)

		cacheStore.fetchResult = {
			timestamp,
		}

		sut.validate()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
		expect(cacheStore.fetchKey).toBe('purchases')
	})
})
