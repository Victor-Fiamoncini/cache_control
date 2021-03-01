import { CacheStore } from '@data/contracts'
import { SavePurchasesUseCase } from '@domain/usecases'

export class LocalSavePurchasesService implements SavePurchasesUseCase {
	constructor(private readonly cacheStore: CacheStore) {}

	async savePurchases(): Promise<void> {
		this.cacheStore.delete('purchases')
	}
}
