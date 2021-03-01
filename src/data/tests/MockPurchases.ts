import { SavePurchasesUseCase } from '@domain/usecases'
import faker from 'faker'

export function mockPurchases(): SavePurchasesUseCase.Params[] {
	return [
		{
			id: faker.random.uuid(),
			date: faker.date.recent(),
			value: faker.random.number(),
		},
		{
			id: faker.random.uuid(),
			date: faker.date.recent(),
			value: faker.random.number(),
		},
	]
}
