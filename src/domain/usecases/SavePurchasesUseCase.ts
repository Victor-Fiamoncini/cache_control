namespace SavePurchasesUseCase {
	export type Params = {
		id: string
		date: Date
		price: number
	}
}

export interface SavePurchasesUseCase {
	savePurchases(purchases: SavePurchasesUseCase.Params[]): Promise<void>
}
