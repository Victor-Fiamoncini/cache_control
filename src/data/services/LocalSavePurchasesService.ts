import { CacheStore } from '@data/contracts'
import { SavePurchasesUseCase } from '@domain/usecases'

export class LocalSavePurchasesService implements SavePurchasesUseCase {
	constructor(
		private readonly cacheStore: CacheStore,
		private readonly timestamp: Date
	) {}

	async savePurchases(purchases: SavePurchasesUseCase.Params[]): Promise<void> {
		this.cacheStore.replace('purchases', {
			timestamp: this.timestamp,
			value: purchases,
		})
	}
}
