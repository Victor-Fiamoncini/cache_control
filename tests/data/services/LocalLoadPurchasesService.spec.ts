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

	test('should not insert new cache if the delete fails', async () => {
		const { sut, cacheStore } = makeSut()

		cacheStore.simulateDeleteError()

		const promise = sut.savePurchases(mockPurchases())

		expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
		await expect(promise).rejects.toThrow()
	})

	test('should insert new cache if delete succeeds', async () => {
		const timestamp = new Date()
		const { sut, cacheStore } = makeSut(timestamp)

		const purchases = mockPurchases()

		const promise = sut.savePurchases(purchases)

		expect(cacheStore.actions).toEqual([
			CacheStoreSpy.Action.delete,
			CacheStoreSpy.Action.insert,
		])
		expect(cacheStore.deleteKey).toBe('purchases')
		expect(cacheStore.insertKey).toBe('purchases')
		expect(cacheStore.insertValues).toEqual({
			timestamp,
			value: purchases,
		})
		await expect(promise).resolves.toBeFalsy()
	})

	test('should throw if insert throws', async () => {
		const { sut, cacheStore } = makeSut()

		cacheStore.simulateInsertError()

		const promise = sut.savePurchases(mockPurchases())
		expect(cacheStore.actions).toEqual([
			CacheStoreSpy.Action.delete,
			CacheStoreSpy.Action.insert,
		])
		await expect(promise).rejects.toThrow()
	})
})
