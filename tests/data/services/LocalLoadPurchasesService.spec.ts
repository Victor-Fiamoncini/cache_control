import { LocalLoadPurchasesService } from '@data/services'
import { CacheStoreSpy, mockPurchases } from '@tests/data/mocks'

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

describe('LocalLoadPurchasesService', () => {
	test('should not delete or insert cache on sut.init', () => {
		const { cacheStore } = makeSut()

		expect(cacheStore.actions).toEqual([])
	})

	test('should call correct key on load', async () => {
		const { cacheStore, sut } = makeSut()

		await sut.loadPurchases()

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.fetch])
	})
})
