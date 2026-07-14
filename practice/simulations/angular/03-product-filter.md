# Angular — Test 03: Product List with Filters

**Time limit:** 75 minutes
**Status:** ⏳ Pending
**Date completed:** —
**Self-assessment:** —

---

## Scenario

You are building a product catalog screen. Products are loaded from a service and the user can filter them by category and maximum price. Filters apply immediately — no submit button.

## What to build

1. A `ProductListComponent` that loads products on init from a `ProductService`
2. A category dropdown — options are derived from the loaded product list (no hardcoded list)
3. A max price input (number)
4. Filters apply reactively as the user changes them
5. Show the count of visible products: "Showing X of Y products"
6. Each product card shows: name, price, category, and an "Out of stock" badge when `stock === 0`
7. Show a loading state while products are being fetched
8. Show an error message if the fetch fails

## Interfaces and mock

```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}
```

Mock data for the service:

```typescript
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Laptop Pro', price: 1200, category: 'Electronics', stock: 5 },
  { id: 2, name: 'USB-C Hub', price: 45, category: 'Electronics', stock: 0 },
  { id: 3, name: 'Office Chair', price: 350, category: 'Furniture', stock: 12 },
  { id: 4, name: 'Standing Desk', price: 620, category: 'Furniture', stock: 3 },
  { id: 5, name: 'Notebook', price: 8, category: 'Stationery', stock: 100 },
  { id: 6, name: 'Mechanical Keyboard', price: 180, category: 'Electronics', stock: 0 },
  { id: 7, name: 'Monitor 27"', price: 430, category: 'Electronics', stock: 7 },
];
```

## Evaluation — what a good solution looks like

- [ ] Products load on init and show a loading state
- [ ] Category dropdown options come from the data, not hardcoded
- [ ] Both filters work together (category AND max price)
- [ ] Filters are reactive — no submit button needed
- [ ] Product count is correct after filtering
- [ ] "Out of stock" badge appears only when stock is 0
- [ ] Error state is handled

## Bonus (if done before time)

- Add a "Clear filters" button that resets both filters
- Sort products by price (ascending / descending toggle)
