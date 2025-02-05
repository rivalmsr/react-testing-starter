import { it, describe } from 'vitest'
import { db } from './mocks/db';

describe('test suite', () => {
  it('should return true', () => {
    const product = db.product.create({ name: 'Macbook Pro M2', price: 23});
    console.log('product: ', product)
    db.product.delete({ where: {id: { equals: product.id}} })
  })
})