import { CacheStore } from '@data/contracts'
import { SavePurchasesUseCase } from '@domain/usecases'

export class LocalSavePurchasesService implements SavePurchasesUseCase {
	constructor(private readonly cacheStore: CacheStore) {}

	async savePurchases(purchases: SavePurchasesUseCase.Params[]): Promise<void> {
		this.cacheStore.delete('purchases')
		this.cacheStore.insert('purchases', purchases)
	}
}
