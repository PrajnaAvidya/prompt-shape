import { expect } from 'chai'
import { parseTemplate } from '../src/parser'
import { ParserVariables, ValueType } from '../src/types'
import { loadFileContent } from '../src/utils'

describe.skip('arithmetic (old)', () => {
	it('should correctly add two numbers', () => {
		const template = loadFileContent('./test/templates/arithmetic/add.ps.txt')
		const variables: ParserVariables = {
			num: { name: 'num', type: ValueType.number, value: 5, params: [] },
		}

		const result = parseTemplate(template, variables)

		expect(result).to.equal('The sum of 5 and 7 is 12')
	})

	it('should correctly subtract two numbers', () => {
		const template = loadFileContent('./test/templates/arithmetic/subtract.ps.txt')
		const variables: ParserVariables = {
			num: { name: 'num', type: ValueType.number, value: 10, params: [] },
		}

		const result = parseTemplate(template, variables)

		expect(result).to.equal('The difference between 10 and 6 is 4')
	})

	it('should correctly multiply two numbers', () => {
		const template = loadFileContent('./test/templates/arithmetic/multiply.ps.txt')
		const variables: ParserVariables = {
			num: { name: 'num', type: ValueType.number, value: 3, params: [] },
		}

		const result = parseTemplate(template, variables)

		expect(result).to.equal('The product of 3 and 4 is 12')
	})

	it('should correctly divide two numbers', () => {
		const template = loadFileContent('./test/templates/arithmetic/divide.ps.txt')
		const variables: ParserVariables = {
			num: { name: 'num', type: ValueType.number, value: 20, params: [] },
		}

		const result = parseTemplate(template, variables)

		expect(result).to.equal('The quotient of 20 divided by 5 is 4')
	})

	it('should throw an error when dividing by zero', () => {
		const template = loadFileContent('./test/templates/arithmetic/divide-by-zero.ps.txt')
		const variables: ParserVariables = {
			num: { name: 'num', type: ValueType.number, value: 20, params: [] },
		}

		expect(() => parseTemplate(template, variables)).to.throw('Division by zero')
	})
})

describe('arithmetic', () => {
	const variables: ParserVariables = {
		num1: { name: 'num1', type: ValueType.number, value: 5, params: [] },
		num2: { name: 'num2', type: ValueType.number, value: 6, params: [] },
		num3: { name: 'num3', type: ValueType.number, value: 7, params: [] },
		num4: { name: 'num4', type: ValueType.number, value: 8, params: [] },
		num5: { name: 'num5', type: ValueType.number, value: 9, params: [] },
		num6: { name: 'num6', type: ValueType.number, value: 10, params: [] },
	}

	it('should correctly add two numbers', () => {
		const template = loadFileContent('./test/templates/arithmetic/add.ps.txt')

		const result = parseTemplate(template, variables)

		expect(result).to.equal(
			`The sum of 5 and 7 is 12 \nThe sum of 5 and 6 is 11 \nThe sum of 7 and 8 is 15 \nThe sum of 1 and 2 is 3 \nThe sum of 3 and 3 is 6 \nThe sum of 4 and 5 is 9 \nThe sum of 3 and 7 is 10 \nThe sum of 3 and 9 is 12 \nThe sum of 10 and 7 is 17`,
		)
	})

	it('should correctly subtract two numbers', () => {
		const template = loadFileContent('./test/templates/arithmetic/subtract.ps.txt')

		const result = parseTemplate(template, variables)

		expect(result).to.equal(
			`The difference between 5 and 7 is -2 \nThe difference between 5 and 6 is -1 \nThe difference between 7 and 8 is -1 \nThe difference between 1 and 2 is -1 \nThe difference between -1 and 3 is -4 \nThe difference between 4 and -1 is 5 \nThe difference between -1 and -1 is 0 \nThe difference between -1 and 9 is -10 \nThe difference between 10 and -1 is 11`,
		)
	})

	it('should correctly multiply two numbers', () => {
		const template = loadFileContent('./test/templates/arithmetic/multiply.ps.txt')

		const result = parseTemplate(template, variables)

		expect(result).to.equal(
			`The product of 5 and 7 is 35 \nThe product of 5 and 6 is 30 \nThe product of 7 and 8 is 56 \nThe product of 1 and 2 is 2 \nThe product of 2 and 3 is 6 \nThe product of 4 and 6 is 24 \nThe product of 2 and 12 is 24 \nThe product of 2 and 9 is 18 \nThe product of 10 and 12 is 120`,
		)
	})

	it('should correctly divide two numbers', () => {
		const template = loadFileContent('./test/templates/arithmetic/divide.ps.txt')

		const result = parseTemplate(template, variables)

		expect(result).to.equal(
			`The quotient of 5 and 7 is 0.7142857142857143 \nThe quotient of 5 and 6 is 0.8333333333333334 \nThe quotient of 7 and 8 is 0.875 \nThe quotient of 1 and 2 is 0.5 \nThe quotient of 0.5 and 3 is 0.16666666666666666 \nThe quotient of 4 and 0.6666666666666666 is 6 \nThe quotient of 0.5 and 0.75 is 0.6666666666666666 \nThe quotient of 0.5 and 9 is 0.05555555555555555 \nThe quotient of 10 and 0.75 is 13.333333333333334`,
		)
	})

	it('should throw an error when dividing by zero', () => {
		const template = loadFileContent('./test/templates/arithmetic/divide-by-zero.ps.txt')
		const variables: ParserVariables = {
			num: { name: 'num', type: ValueType.number, value: 20, params: [] },
		}

		expect(() => parseTemplate(template, variables)).to.throw('Division by zero')
	})

	it('should correctly compute powers', () => {
		const template = loadFileContent('./test/templates/arithmetic/powers.ps.txt')

		const result = parseTemplate(template, variables)

		expect(result).to.equal(`25\n32`)
	})

	// TODO complex arithmetic/nested parentheses
})
