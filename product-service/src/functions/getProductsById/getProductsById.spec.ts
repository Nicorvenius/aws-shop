import * as getProduct from './getProductsById';
import { productsList } from '../productsListMock';

const { getProductById, findProduct } = getProduct;

const event = {
    pathParameters: '2'
}
const testProduct = {
    "amount": 4,
    "description": "Short Product Description1",
    "id": 0,
    "price": 2.4,
    "title": "ProductOne"
}

describe('getProductById test', () => {
    describe('should return right answer', () => {
        test('return response status 200', async () => {
            (getProduct as any).findProduct = jest.fn(() => testProduct);
            const arrayOfProducts = await getProductById(event);
            expect(arrayOfProducts.statusCode).toBe(200);
        })
    })
    test('return response status 404', async () => {
        (getProduct as any).findProduct = jest.fn(() => undefined);
        const arrayOfProducts = await getProductById(event);
        expect(arrayOfProducts.statusCode).toBe(404);
    })
    test('return response right product', async () => {
        const result = await findProduct(productsList, 3);
        expect(result.id).toBe(3);
    })
    test('should return undefined with incorrect id', async () => {
        const result = await findProduct(productsList, -1);
        expect(result).toBeUndefined();
    })

})
