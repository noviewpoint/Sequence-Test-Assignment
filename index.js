"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
class VendingMachine {
    constructor() {
        // presumption that vending machine can hold limitless amount of products
        this.products = new Map();
        // presumption that vending machine can hold limitless amount of change
        this.changeAmountCents = [0, 0, 0, 0, 0, 0];
        this.denominationsCents = [1, 5, 10, 25, 50, 100];
        this.customerBalanceCents = 0;
    }
    operatorLoadsProducts(products) {
        for (const product of products) {
            const existingProduct = this.products.get(product.name);
            if (!existingProduct) {
                this.products.set(product.name, product);
                continue;
            }
            existingProduct.priceCents = product.priceCents; // overwrite price
            existingProduct.quantity += product.quantity;
        }
    }
    operatorInsertsChange(change) {
        this.acceptChangeInBulk(change);
    }
    customerInsertsChange(change) {
        this.customerBalanceCents += this.getSum(change);
        this.acceptChangeInBulk(change);
    }
    customerSelectsProduct(productName) {
        const product = this.products.get(productName);
        // return early if product is not in stock
        if (!product || ((product === null || product === void 0 ? void 0 : product.quantity) || 0) < 1) {
            return ["This product is not in stock", [0, 0, 0, 0, 0, 0]];
        }
        // return early if balance is too low
        if (this.customerBalanceCents < product.priceCents) {
            return ["Insufficient funds", [0, 0, 0, 0, 0, 0]];
        }
        this.customerBalanceCents -= product.priceCents;
        product.quantity--;
        return [
            "Here you go and here is the change",
            this.customerDemandsHisMoneyBack(),
        ];
    }
    customerDemandsHisMoneyBack() {
        const returnedChange = [0, 0, 0, 0, 0, 0];
        for (let i = this.denominationsCents.length - 1; i > -1; i--) {
            const denomination = this.denominationsCents[i];
            // console.log('START', this.changeAmountCents);
            const howMany = Math.min(Math.floor(this.customerBalanceCents / denomination), this.changeAmountCents[i]);
            this.customerBalanceCents -= howMany * denomination;
            returnedChange[i] = howMany;
            // console.log('Machine returns', howMany, 'of', denomination, 'cents to the customer. Customer balance is:', this.customerBalanceCents);
            this.changeAmountCents[i] -= howMany;
            // console.log('FINISH', this.changeAmountCents);
        }
        return returnedChange;
    }
    getSum(change) {
        return change.reduce((sum, num, i) => {
            sum += num * this.denominationsCents[i];
            return sum;
        }, 0);
    }
    acceptChangeInBulk(change) {
        for (let i = 0, len = change.length; i < len; i++) {
            this.changeAmountCents[i] += change[i];
        }
    }
}
// TESTS;
const vendingMachine = new VendingMachine();
vendingMachine.operatorLoadsProducts([
    { name: "sandwich", priceCents: 295, quantity: 30 },
]);
vendingMachine.operatorInsertsChange([50, 50, 50, 50, 50, 50]);
vendingMachine.customerInsertsChange([0, 0, 0, 0, 0, 2]);
assert_1.strict.deepStrictEqual(vendingMachine.customerSelectsProduct("m&m"), [
    "This product is not in stock",
    [0, 0, 0, 0, 0, 0],
]);
assert_1.strict.deepStrictEqual(vendingMachine.customerSelectsProduct("sandwich"), [
    "Insufficient funds",
    [0, 0, 0, 0, 0, 0],
]);
vendingMachine.operatorLoadsProducts([
    { name: "coca-cola", priceCents: 65, quantity: 60 },
]);
vendingMachine.customerInsertsChange([0, 0, 0, 0, 0, 1]);
assert_1.strict.deepStrictEqual(vendingMachine.customerSelectsProduct("sandwich"), [
    "Here you go and here is the change",
    [0, 1, 0, 0, 0, 0],
]);
vendingMachine.customerInsertsChange([0, 1, 1, 0, 0, 1]);
assert_1.strict.deepStrictEqual(vendingMachine.customerSelectsProduct("coca-cola"), [
    "Here you go and here is the change",
    [0, 0, 0, 0, 1, 0],
]);
