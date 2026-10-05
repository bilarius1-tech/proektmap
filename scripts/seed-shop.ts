import { seedShopBooks } from "../src/lib/shop/seed-books";

seedShopBooks()
  .then(() => {
    console.log("Книги магазина записаны");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
