import { LocalSavePurchasesService } from '@data/services'
import { CacheStoreSpy, mockPurchases } from '@tests/data/mocks'

type SutTypes = {
	sut: LocalSavePurchasesService
	cacheStore: CacheStoreSpy
}

function makeSut(): SutTypes {
	const cacheStoreSpy = new CacheStoreSpy()

	const sut = new LocalSavePurchasesService(cacheStoreSpy)

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

	test('should delete old cache on sut.save', async () => {
		const { sut, cacheStore } = makeSut()

		await sut.savePurchases(mockPurchases())

		expect(cacheStore.messages).toEqual([
			CacheStoreSpy.Message.delete,
			CacheStoreSpy.Message.insert,
		])
		expect(cacheStore.deleteKey).toBe('purchases')
	})

	test('should not insert new cache if the delete fails', () => {
		const { sut, cacheStore } = makeSut()

		cacheStore.simulateDeleteError()

		const promise = sut.savePurchases(mockPurchases())

		expect(cacheStore.messages).toEqual([CacheStoreSpy.Message.delete])
		expect(promise).rejects.toThrow()
	})

	test('should insert new cache if delete succeeds', async () => {
		const { sut, cacheStore } = makeSut()

		const purchases = mockPurchases()

		await sut.savePurchases(purchases)

		expect(cacheStore.messages).toEqual([
			CacheStoreSpy.Message.delete,
			CacheStoreSpy.Message.insert,
		])
		expect(cacheStore.insertKey).toBe('purchases')
		expect(cacheStore.insertValues).toEqual(purchases)
	})

	test('should throw if insert throws', () => {
		const { sut, cacheStore } = makeSut()

		cacheStore.simulateInsertError()

		const promise = sut.savePurchases(mockPurchases())
		expect(cacheStore.messages).toEqual([
			CacheStoreSpy.Message.delete,
			CacheStoreSpy.Message.insert,
		])
		expect(promise).rejects.toThrow()
	})
})
