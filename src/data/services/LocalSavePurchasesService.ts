import { CacheStore } from '@data/contracts'

export class LocalSavePurchasesService {
	constructor(private readonly cacheStore: CacheStore) {}

	async save(): Promise<void> {
		this.cacheStore.delete('purchases')
	}
}
