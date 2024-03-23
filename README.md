# ecomint (E-Commerce Category Interest Tracker)

The E-Commerce Category Interest Tracker is a web application designed to facilitate user registration, login, and category selection for an e-commerce platform. Users can sign up for a new account, log in to an existing account, and mark their interests in various product categories. The application stores user preferences in a database, allowing users to see their selected categories upon subsequent logins.

## Features

1. **User Registration:** New users can sign up for an account by providing their email address and creating a password.
   
2. **User Login:** Existing users can log in to their accounts using their email address and password.

3. **Category Selection:** Upon logging in, users are presented with a list of product categories generated using Faker.js. Users can navigate through paginated categories and mark their interests by selecting checkboxes.

4. **Persistent Preferences:** User-selected category preferences are stored in the database, ensuring that users can view their chosen categories upon logging in again.

## Tech Stack

- **Database:** PostgreSQL (Hosted on Neon)
  
- **Framework:** Next.js (Provided by create.t3.gg)
  
- **API:** tRPC
  
- **Database ORM:** Prisma
  
- **CSS Framework:** Tailwind CSS
  
- **Email Verification:** Nodemailer library
  
## Submission

Application is live on https://ecomint.vercel.app
