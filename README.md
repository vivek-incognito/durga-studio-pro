# Durga Studio Pro

DURGA STUDIO – ADVANCED FEATURES UPDATE

Upgrade the existing Durga Studio website by implementing all four additional features below. Maintain the existing Classic Blue, Turquoise and Gold theme. Do not redesign or remove existing functionality.

1. PROFESSIONAL STUDIO GALLERY

Create a dedicated Gallery page with categories:

Passport Photography

Photo Frames

Custom Banners

Wedding Photography

Birthday Functions

Engagement Photography

Event Videography

Album Designs

Requirements:

Use real, high-quality photography.

Create a clean masonry-style gallery.

Add category filters.

Add smooth image transitions.

Open images in a full-screen lightbox.

Make the gallery responsive.

Allow the admin to upload, edit and delete gallery images.

Do not use random images as actual Durga Studio work. Clearly distinguish sample photography from actual studio work.

2. CUSTOMER ORDER TRACKING

Create an Order Tracking page.

Customers can track orders using their unique Order ID and registered mobile number.

Order statuses:

Order Received

Pending Confirmation

Confirmed

In Production

Ready for Pickup

Completed

Cancelled

Display a visual progress tracker with timestamps and status descriptions.

Show:

Order ID

Customer name

Order date

Products ordered

Selected branch

Total estimated amount

Current order status

Allow the admin to update order statuses.

Customers must only be able to view orders matching their Order ID and verified mobile number. Do not expose other customers' orders.

3. PRIVATE ADMIN DASHBOARD

Create a secure admin dashboard accessible through a separate login page.

Only authorized administrators should access it.

Dashboard sections:

Overview

Total orders

Pending orders

Confirmed orders

Completed orders

Total order value

Recent orders

Order Management

View all orders.

Search by Order ID.

Search by customer name.

Filter by branch.

Filter by order status.

View customer contact information.

View uploaded photographs and designs.

Update order status.

Add internal notes.

Contact customers through WhatsApp.

Product Management

Add products.

Edit products.

Delete products.

Update prices.

Update product descriptions.

Enable or disable products.

Manage passport photo, frame, banner and event service prices.

Gallery Management

Upload photographs.

Edit descriptions.

Select gallery categories.

Delete photographs.

Branch Management

Edit main branch information.

Add the second branch address later.

Update branch contact information.

Update Google Maps links.

Customer Management

View customer order history.

Search customers.

View customer details.

Use Supabase authentication, database and storage. Configure secure Row Level Security (RLS) policies. Never expose admin credentials or privileged service keys in frontend code.

Do not create a fake admin login. Implement actual authentication.

4. CUSTOMER PHOTO AND DESIGN UPLOAD

Add upload functionality to the relevant product pages and checkout.

Passport Photos

Allow customers to upload their passport photograph.

Photo Frames

Allow customers to upload the image they want printed and framed.

Custom Banners

Allow customers to upload:

Banner designs

Logos

Reference photographs

Function Photography

Allow customers to upload reference photographs or event requirements.

Requirements:

Support JPG, JPEG, PNG and PDF where appropriate.

Show image previews.

Show uploaded filenames.

Allow customers to remove and replace uploads.

Show upload progress.

Set reasonable file size limits.

Store files securely using Supabase Storage.

Link uploaded files to their respective orders.

Ensure customers cannot access other customers' uploaded files.

5. IMPORTANT INTEGRATION REQUIREMENTS

All four features must integrate with the existing shopping cart, checkout, customer details, WhatsApp ordering and branch selection.

Generate a unique Order ID for each successfully submitted order.

Store order information in a database only after successful submission.

Create the necessary Supabase tables and relationships.

Implement secure authentication and access permissions.

The admin dashboard must be completely private.

Keep the customer website clean and minimalistic. Do not overcrowd the homepage with dashboard features.

Maintain the existing Durga Studio branding and responsive design.

Do not use emojis. Use professional icons and real photography images.

Build fully working features rather than static mockups. Clearly identify any backend configuration or deployment steps that still require administrator setup.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/2cbbea4c-d61f-5e8d-b48a-ef1e39f9d6ba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
