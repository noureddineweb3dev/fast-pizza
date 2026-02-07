# 🍕 Fast Pizza

**Fast Pizza** is a modern, responsive web application for ordering pizzas, built to demonstrate production-ready React patterns and best practices. It features a seamless ordering flow, real-time-like order tracking, and a comprehensive admin dashboard for managing store operations.

![Home Screen](/public/screenshots/home.png)
> *Note: Please add a screenshot of the home page at `public/screenshots/home.png`*

## 🚀 Tech Stack

We chose this stack to balance performance, developer experience, and scalability:

-   **React 19**: Utilizing the latest features for building interactive UIs.
-   **Vite**: For lightning-fast development server and optimized production builds.
-   **Redux Toolkit**: To manage global state (cart, user, order) efficiently.
-   **React Router**: For client-side routing, utilizing **Loaders** and **Actions** to handle data fetching and form submissions cleanly.
-   **Tailwind CSS**: For rapid, utility-first styling that ensures a unique and responsive design.
-   **Supabase / API**: (Connected via `apiRestaurant.js`) responsible for data persistence.

## ✨ Key Features

-   **Browse Menu**: View a list of available pizzas with details and prices.
-   **Cart Management**: Add, remove, and adjust quantities of pizzas in the cart.
-   **User Accounts**: Sign up and login to save preferences and order history.
-   **Favorites**: Save your favorite pizzas for quick access.
-   **Order Creation**: Place orders with delivery location (geolocation support) and priority options.
-   **Order Tracking**: Search for an order by ID to see its status and estimated delivery time.
-   **Order History**: View past orders and their details.
-   **Admin Dashboard**: A restricted area for store admins to update order statuses and manage operations.

## 📸 Screenshots

### Customer Journey

| Menu | Cart |
|:---:|:---:|
| ![Menu Page](/public/screenshots/menu.png) | ![Cart Page](/public/screenshots/cart.png) |
| *Browse our delicious pizzas* | *Manage your items before checkout* |

| Favorites | Order Form |
|:---:|:---:|
| ![Favorites Page](/public/screenshots/favorites.png) | ![Order New](/public/screenshots/order-new.png) |
| *Quick access to your loved ones* | *Fast and easy checkout* |

| Order Status | Order History |
|:---:|:---:|
| ![Order Status](/public/screenshots/order.png) | ![Order History](/public/screenshots/order-history.png) |
| *Track your delivery in real-time* | *Review your past delicious moments* |

### Administrative & Utility

| Admin Dashboard | Authentication |
|:---:|:---:|
| ![Admin Dashboard](/public/screenshots/admin-dashboard.png) | ![Login/Signup](/public/screenshots/auth.png) |
| *Manage store orders and status* | *Secure user access* |

## 🛠️ Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/fast-pizza.git
    cd fast-pizza
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit `http://localhost:5173` in your browser.

## 📂 Project Structure

This project follows a feature-based folder structure to keep code maintainable:

-   `src/features/`: Contains all business logic, grouped by domain.
    -   `menu`: Menu display and interaction.
    -   `cart`: Cart state and UI.
    -   `order`: Order placement, tracking, and history.
    -   `user`: Authentication and profile management.
    -   `admin`: Back-office dashboard.
    -   `favorites`: User favorites management.
-   `src/ui/`: Reusable UI components (buttons, loaders, headers) that are feature-agnostic.
-   `src/services/`: API interaction layer to keep components clean.
-   `src/store/`: Redux store configuration and slices.
-   `src/utils/`: Helper functions and constants.
-   `src/hooks/`: Custom React hooks.

## 🧠 Learnings & Best Practices

-   **State Management**: We use Redux only for global state (cart, user). Local UI state is kept in components.
-   **Data Fetching**: React Router's `loader` functions are used to fetch data *before* rendering the route, preventing waterfall requests.
-   **Form Handling**: React Router's `action` functions handle form submissions, allowing us to manage side effects (like POST requests) outside of components.
-   **Performance**: Memoization (`useMemo`, `useCallback`) is used where necessary to prevent unnecessary re-renders.

---

*Built with ❤️ by Project Genesis*
