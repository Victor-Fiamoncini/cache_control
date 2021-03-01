import { CacheStore } from '@data/contracts'
import { LocalSavePurchasesService } from '@data/services'

class CacheStoreSpy implements CacheStore {
	deleteCallsCount = 0
	insertCallsCount = 0
	deleteKey: string
	insertKey: string

	delete(key: string): void {
		this.deleteCallsCount++
		this.deleteKey = key
	}

	insert(key: string): void {
		this.insertCallsCount++
		this.insertKey = key
	}
}

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
	test('should not delete cache on sut.init', () => {
		const { cacheStore } = makeSut()

		expect(cacheStore.deleteCallsCount).toBe(0)
	})

	test('should delete old cache on sut.save', async () => {
		const { sut, cacheStore } = makeSut()

		await sut.savePurchases()

		expect(cacheStore.deleteCallsCount).toBe(1)
		expect(cacheStore.deleteKey).toBe('purchases')
	})

	test('should not insert new cache if the delete fails', () => {
		const { sut, cacheStore } = makeSut()

		jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => {
			throw new Error()
		})

		const promise = sut.savePurchases()

		expect(cacheStore.insertCallsCount).toBe(0)
		expect(promise).rejects.toThrow()
	})

	test('should insert new cache if delete succeeds', async () => {
		const { sut, cacheStore } = makeSut()

		await sut.savePurchases()

		expect(cacheStore.deleteCallsCount).toBe(1)
		expect(cacheStore.insertCallsCount).toBe(1)
		expect(cacheStore.insertKey).toBe('purchases')
	})
})
