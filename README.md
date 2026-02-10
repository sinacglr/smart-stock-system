# Smart Stock System

This is a Stock Management & Dynamic Pricing project. It simulates a real store where product prices change automatically based on supply and demand.

## What Does It Do?

1.  **Smart Pricing:** If the stock of a product is low, the price automatically increases.
2.  **Dashboard:** Shows total revenue, total orders, and critical stocks.
3.  **Price History:** Shos how the price changed over time.
4.  **Panel:** You can sell items or increase stock of a product.

## Tools Used

* **Next.js 15** 
* **TypeScript** 
* **Prisma** 
* **PostgreSQL** 
* **Docker**
* **Tailwind CSS** 

## How to Run 

**1. Clone the repo**
```bash
git clone [https://github.com/sinacglr/smart-stock-system.git](https://github.com/sinacglr/smart-stock-system.git)
cd smart-stock-system```

**2. Install packages**
```npm install```

**3. Start the database**
```docker-compose up -d```

**4. Setup Database**
```npx prisma db push```
```npx prisma db seed```

**5. Run the app**
```npm run```

Go to http://localhost:3000
