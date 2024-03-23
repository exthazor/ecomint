# ECOMINT (E-Commerce Category Interest Tracker)

The E-Commerce Category Interest Tracker is a web application designed to facilitate user registration, login, and category selection for an e-commerce platform. Users can sign up for a new account, log in to an existing account, and mark their interests in various product categories. The application stores user preferences in a database, allowing users to see their selected categories upon subsequent logins. It is made on t3.


## Procedures Reference

This application uses tRPC, enabling type-safe API-like interactions without traditional HTTP endpoints. Below are the available procedures you can call from the frontend, along with their expected inputs and outputs.

### Using tRPC Procedures
tRPC abstracts away the traditional HTTP request-response cycle into direct procedure calls. This means you can interact with the backend seamlessly without dealing with endpoints directly. tRPC provides two main types of procedures:

Queries: For fetching data. They are similar to GET requests in a REST API.
Mutations: For submitting data changes. They align with POST, PUT, DELETE, etc., in REST APIs.
To call these procedures, you utilize the trpc hook provided by tRPC's React query hooks.

Example of a query:

```
const { data, isLoading } = trpc.useQuery(['getCategories', { /* optional parameters */ }]);
```
Example of a mutation:

```
const mutation = trpc.useMutation(['createCategory']);
const handleSubmit = () => {
  mutation.mutate({ name: 'New Category' });
};
```

### User Procedures

#### Register User

```http
  mutation: user.register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. The user's name |
| `email` | `string` | **Required**. The user's email address |
| `password` | `string` | **Required**. The user's chosen password |

#### Verify OTP of Newly Registered User

```http
  mutation: user.verifyOtp
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. The user's email address |
| `otp` | `string` | **Required**. OTP received by user on his email address |

#### Authenticate/Validate User's Session

```http
  mutation: user.validateToken
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authToken` | `string` | **Required**. The user's auth token |


#### Login Existing User

```http
  mutation: user.login
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. The user's email address |
| `password` | `string` | **Required**. The user's password |

#### Logout Existing User

```http
  mutation: user.logout
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `authToken` | `string` | **Required**. The user's auth token |

### Category Procedures

#### List Categories

```http
  query: category.list
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `page` | `number` | **Required**. The user's auth token |
| `limit` | `number` | **Required**. The user's auth token |

#### Toggle Interest in Categories

```http
  mutation: category.toggleInterest
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `categoryId` | `number` | **Required**. The page number of the categories list to fetch |
| `interested` | `boolean` | **Required**. The number of categories per page|

## Tech Stack

**Database:** PostgreSQL (Hosted on Neon)

**Framework:** Next.js (Provided by create.t3.gg)

**API:** tRPC

**Database ORM:** Prisma

**CSS Framework:** Tailwind CSS

**Email Verification:** Nodemailer library
## Demo

Application is live on https://ecomint.vercel.app

## Screenshots

![Login Page](https://github.com/exthazor/ecomint/assets/25245510/9c0a07f0-7bbb-42c0-b96c-a1ffdeaa6b09)

![Category Home Page](https://github.com/exthazor/ecomint/assets/25245510/0d1b1243-1913-4d49-bf16-e422ccf87296)

![Add/Remove Interest](https://github.com/exthazor/ecomint/assets/25245510/70321948-ff92-4d4d-92ae-ef0b9443fd74)

![Signup Page](https://github.com/exthazor/ecomint/assets/25245510/d6faf0a8-7a82-4e7c-b694-32f0a7e45564)

![Verify OTP Page](https://github.com/exthazor/ecomint/assets/25245510/7f2fe17e-baf4-450f-b695-47745e503c5b)


## Acknowledgements

 - [tRPC Documentation](https://trpc.io/docs/quickstart)
 - [neon.tech](https://neon.tech/docs/introduction)
