import { LocalSavePurchasesService } from '@data/services'
import { CacheStoreSpy, mockPurchases } from '@tests/data/mocks'

type SutTypes = {
	sut: LocalSavePurchasesService
	cacheStore: CacheStoreSpy
}

function makeSut(timestamp = new Date()): SutTypes {
	const cacheStoreSpy = new CacheStoreSpy()

	const sut = new LocalSavePurchasesService(cacheStoreSpy, timestamp)

	return {
		sut,
		cacheStore: cacheStoreSpy,
	}
}

describe('LocalSavePurchasesService', () => {
	test('should not delete or insert cache on sut.init', () => {
		const { cacheStore } = makeSut()

		expect(cacheStore.messages).toEqual([])
	})

	test('should not insert new cache if the delete fails', async () => {
		const { sut, cacheStore } = makeSut()

		cacheStore.simulateDeleteError()

		const promise = sut.savePurchases(mockPurchases())

		expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
		await expect(promise).rejects.toThrow()
	})

	test('should insert new cache if delete succeeds', async () => {
		const timestamp = new Date()
		const { sut, cacheStore } = makeSut(timestamp)

		const purchases = mockPurchases()

		const promise = sut.savePurchases(purchases)

		expect(cacheStore.messages).toEqual([
			CacheStoreSpy.Message.delete,
			CacheStoreSpy.Message.insert,
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
		expect(cacheStore.messages).toEqual([
			CacheStoreSpy.Message.delete,
			CacheStoreSpy.Message.insert,
		])
		await expect(promise).rejects.toThrow()
	})
})
