import * as getProducts from '../../../src/functions/getProductsList/getProductsList';

const { getProductsList } = getProducts;

describe('getProductsList test', () => {
    describe('should return Object', () => {
        test('return data as Object', async () => {
            const arrayOfProducts = await getProductsList();
            expect(arrayOfProducts).toBeInstanceOf(Object);
        })
        test('should return correct statusCode', async () => {
            const arrayOfProducts = await getProductsList();
            expect(arrayOfProducts.statusCode).toBe(200);
        })
    })
    describe('should return Error', () => {
        test('should return error 500', async () => {
            (getProducts as any).getData = jest.fn(() => null);
            const response = await getProductsList();
            expect(response.statusCode).toBe(500);
        });
        test('should be called', async () => {
            (getProducts as any).getData = jest.fn(() => null);
            await getProductsList();
            expect(getProducts.getData).toBeCalled();
        });
    })
})
