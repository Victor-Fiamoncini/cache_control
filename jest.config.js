module.exports = {
	roots: ['<rootDir>/src'],
	testEnvironment: 'node',
	transform: {
		'.+\\.ts$': 'ts-jest',
	},
	moduleNameMapper: {
		'@data/(.*)': '<rootDir>/src/data/$1',
	},
}
