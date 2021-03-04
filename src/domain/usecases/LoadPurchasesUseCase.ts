import { Purchase } from '@domain/entities'

export namespace LoadPurchasesUseCase {
	export type Result = Purchase
}

export interface LoadPurchasesUseCase {
	loadPurchases(): Promise<LoadPurchasesUseCase.Result[]>
}
